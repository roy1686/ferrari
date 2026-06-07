import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import introCarImg from '../assets/a371cd9345a49b9b3bbd758cbcacdf5f.jpg';
import './Preloader.css';

const Preloader = () => {
  const [phase, setPhase] = useState('logo'); // 'logo', 'rev', 'fade'

  useEffect(() => {
    // Phase 1: Logo display for 1.5s
    const t1 = setTimeout(() => {
      setPhase('rev');
    }, 1500);

    // Phase 2: Scary car intro for exactly 5.5 seconds
    const t2 = setTimeout(() => {
      setPhase('fade');
    }, 7000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className={`preloader ${phase === 'fade' ? 'fade-out' : ''}`}>
      {phase === 'logo' && (
        <img src={logo} alt="Ferrari Logo" className="intro-logo" />
      )}
      
      {phase === 'rev' && (
        <div className="scary-car-intro">
           <div className="mist-container">
             <div className="mist-layer mist-1"></div>
             <div className="mist-layer mist-2"></div>
           </div>
           
           <div className="real-car-reveal">
             <img 
               src={introCarImg} 
               alt="Ferrari in Tunnel" 
               className="real-car-img" 
             />
             <div className="real-car-vignette"></div>
             
             <div className="flicker-headlights">
               <div className="headlight left"></div>
               <div className="headlight right"></div>
             </div>
           </div>
           
           <div className="mist-layer mist-3"></div>
        </div>
      )}
    </div>
  );
};

export default Preloader;
