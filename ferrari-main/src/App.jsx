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
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    let scrollTimeout;
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      if (Math.abs(window.scrollY - lastScrollY) > 800) {
        SoundManager.play('turbo-whoosh', 0.10);
        lastScrollY = window.scrollY;
      }
    };
    
    const throttledScroll = () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          handleScroll();
          scrollTimeout = null;
        }, 400);
      }
    };
    window.addEventListener('scroll', throttledScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', throttledScroll);
    };
  }, []);

  return (
    <>
      <CustomCursor />
      <Preloader />
      
      <div className={`main-content ${loading ? 'hidden' : 'visible'}`}>
        <Navbar />
        <HeroSlider />
        <LiveStats />
        <RedSection />
        <Showcase />
        
        {/* --- THE MASTERPIECE SECTIONS --- */}
        <HeritageTimeline />
        <Configurator />
        <WarRoom />
        
        <Footer />
        <SoundToggle />
      </div>
    </>
  );
}

export default App;
