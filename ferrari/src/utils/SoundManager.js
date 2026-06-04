class SoundManagerClass {
  constructor() {
    this.masterVolume = 0.15;
    this.isMuted = true; // Wait for user interaction
    this.sounds = {};
    this.initialized = false;
    this.initialPlayDone = false;

    // Check local storage for persistence
    const saved = localStorage.getItem('ferrari-muted');
    if (saved !== null) {
      this.isMuted = saved === 'true';
    }

    // Check reduced motion - respect accessibility
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.prefersReducedMotion) {
      this.isMuted = true;
    }

    // Fallback internet URLs for the requested premium sounds
    this.soundPaths = {
      'engine-start': 'https://cdn.freesound.org/previews/432/432688_9159316-lq.mp3',
      'idle-loop': 'https://cdn.freesound.org/previews/316/316847_5123851-lq.mp3',
      'gear-click': 'https://cdn.freesound.org/previews/256/256113_3263906-lq.mp3',
      'paddle-shift': 'https://cdn.freesound.org/previews/411/411642_5121236-lq.mp3',
      'tire-chirp': 'https://cdn.freesound.org/previews/523/523651_11861866-lq.mp3',
      'full-rev': 'https://cdn.freesound.org/previews/432/432687_9159316-lq.mp3',
      'v8-growl': 'https://cdn.freesound.org/previews/369/369955_6890985-lq.mp3',
      'turbo-whoosh': 'https://cdn.freesound.org/previews/537/537731_11861866-lq.mp3',
      'v12-roar': 'https://cdn.freesound.org/previews/460/460362_9417696-lq.mp3',
      'drive-away': 'https://cdn.freesound.org/previews/433/433829_2398403-lq.mp3'
    };
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;

    // Preload audio objects silently
    Object.keys(this.soundPaths).forEach(name => {
      const audio = new Audio(this.soundPaths[name]);
      audio.preload = 'auto';
      audio.loop = (name === 'idle-loop');
      this.sounds[name] = audio;
    });
  }

  toggleMute(userInitiatedState = undefined) {
    this.init();

    if (userInitiatedState !== undefined) {
      this.isMuted = userInitiatedState;
    } else {
      this.isMuted = !this.isMuted;
    }

    localStorage.setItem('ferrari-muted', this.isMuted.toString());

    if (!this.isMuted) {
      // Woke up engine context
      if (!this.initialPlayDone) {
        this.initialPlayDone = true;
        this.play('engine-start', 0.12);
        setTimeout(() => {
          this.fadeIn('idle-loop', 0.08, 3000);
        }, 2500); // fade in idle slightly after start peak
      } else {
        // Just un-paused
        this.fadeIn('idle-loop', 0.08, 1000);
      }
    } else {
      this.stopAll();
    }
  }

  play(name, volumeOverride = null) {
    if (this.isMuted) return;
    this.init();

    const audio = this.sounds[name];
    if (!audio) return;

    // Reset unlooped audios so they can overlap if spammed safely (or restart)
    if (!audio.loop) {
      audio.currentTime = 0;
    }

    audio.volume = volumeOverride !== null ? volumeOverride : this.masterVolume;
    audio.play().catch(e => { console.warn('Audio play blocked: ', e); });
  }

  stop(name) {
    if (!this.sounds[name]) return;
    this.sounds[name].pause();
    this.sounds[name].currentTime = 0;
  }

  stopAll() {
    Object.values(this.sounds).forEach(audio => {
      const isLoop = audio.loop;
      // We can just pause them all, fading is better but strict pause to respect mute instantly
      audio.pause();
    });
  }

  fadeIn(name, targetVolume = 0.1, duration = 1000) {
    if (this.isMuted) return;
    this.init();
    const audio = this.sounds[name];
    if (!audio) return;

    audio.volume = 0;
    audio.play().catch(() => { });

    let vol = 0;
    const steps = 20;
    const stepDuration = duration / steps;
    const stepVol = targetVolume / steps;

    const interval = setInterval(() => {
      vol += stepVol;
      if (vol >= targetVolume) {
        audio.volume = targetVolume;
        clearInterval(interval);
      } else {
        audio.volume = vol;
      }
    }, stepDuration);
  }

  fadeOut(name, duration = 1000) {
    const audio = this.sounds[name];
    if (!audio || audio.paused) return;

    let vol = audio.volume;
    if (vol === 0) {
      audio.pause();
      return;
    }

    const steps = 20;
    const stepDuration = duration / steps;
    const stepVol = vol / steps;

    const interval = setInterval(() => {
      vol -= stepVol;
      if (vol <= 0.01) {
        audio.pause();
        audio.volume = 0;
        clearInterval(interval);
      } else {
        audio.volume = vol;
      }
    }, stepDuration);
  }

  setMasterVolume(level) {
    this.masterVolume = level;
  }
}

export const SoundManager = new SoundManagerClass();
