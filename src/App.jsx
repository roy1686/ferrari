import { useState, useEffect } from 'react';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import LiveStats from './components/LiveStats';
import RedSection from './components/RedSection';
import Showcase from './components/Showcase';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import SoundToggle from './components/SoundToggle';
import HeritageTimeline from './components/HeritageTimeline';
import Configurator from './components/Configurator';
import WarRoom from './components/WarRoom';
import { SoundManager } from './utils/SoundManager';
import Lenis from 'lenis';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    const timer = setTimeout(() => {
      setLoading(false);
    }, 6500); // Wait for the new 6-second preloader animation + fade
    
    const handleFirstInteraction = () => {
      if (!SoundManager.isMuted && !SoundManager.initialPlayDone) {
        // Automatically plays intro sequence in init logic
        SoundManager.toggleMute(false);
      }
    };
    window.addEventListener('scroll', handleFirstInteraction, { once: true });
    window.addEventListener('click', handleFirstInteraction, { once: true });

    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();
    let scrollTimeout;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const timeDelta = currentTime - lastScrollTime;
      const scrollDelta = currentScrollY - lastScrollY;
      
      if (timeDelta > 0) {
        // Calculate velocity (pixels per ms)
        const velocity = Math.abs(scrollDelta / timeDelta);
        
        // Cap the velocity to a max value for the effect
        const normalizedVelocity = Math.min(velocity / 3, 1); 
        
        // Apply to body for global effects
        document.body.style.setProperty('--scroll-velocity', normalizedVelocity);
        
      }
      
      // Existing turbo sound logic
      if (Math.abs(scrollDelta) > 800) {
        SoundManager.play('turbo-whoosh', 0.10);
      }
      
      lastScrollY = currentScrollY;
      lastScrollTime = currentTime;
      
      // Reset velocity when scrolling stops
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        document.body.style.setProperty('--scroll-velocity', 0);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <CustomCursor />
      <Preloader />
      
      <div className={`main-content ${loading ? 'hidden' : 'visible'}`}>
        <Navbar />
        <div id="home"><HeroSlider /></div>
        <LiveStats />
        <div id="collections"><RedSection /></div>
        <div id="sports-cars"><Showcase /></div>
        
        {/* --- THE MASTERPIECE SECTIONS --- */}
        <div id="about"><HeritageTimeline /></div>
        <div id="configurator"><Configurator /></div>
        <div id="racing"><WarRoom /></div>
        
        <Footer />
        <SoundToggle />
      </div>
    </>
  );
}

export default App;
