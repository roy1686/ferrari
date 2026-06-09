import { useState, useEffect } from 'react';
import { SoundManager } from '../utils/SoundManager';
import './SoundToggle.css';

const SoundToggle = () => {
  // Read initial state
  const [isPlaying, setIsPlaying] = useState(!SoundManager.isMuted);

  // Allow SoundManager state to reflect here if changed externally
  useEffect(() => {
    const handleMute = () => setIsPlaying(!SoundManager.isMuted);
    window.addEventListener('blur', () => {
      // Browsers often mute when tab loses focus, we could hook this
    });
    return () => window.removeEventListener('blur', handleMute);
  }, []);

  const toggleSound = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    // Since SoundManager.isMuted is true when OFF. 
    // If we want playing (ON), userInitiatedState should be false (unmuted).
    SoundManager.toggleMute(!nextState); 
  };

  return (
    <div className={`sound-toggle-btn ${isPlaying ? 'active' : 'inactive'}`} onClick={toggleSound}>
      {isPlaying ? (
        <div className="waveform playing">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      ) : (
        <div className="waveform off">
          <span className="line"></span>
        </div>
      )}
    </div>
  );
};

export default SoundToggle;
