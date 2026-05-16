import { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import logo from '../assets/logo.png';
import { SoundManager } from '../utils/SoundManager';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const clickCount = useRef(0);

  const handleLogoClick = () => {
    clickCount.current += 1;
    if (clickCount.current === 3) {
      SoundManager.play('v12-roar', 0.20);
      clickCount.current = 0;
    }
  };

  const handleNavHover = () => {
    SoundManager.play('gear-click', 0.08);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : 'transparent'}`}>
      <div className="nav-container">
        <div className="nav-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="Ferrari Logo" className="logo-img" />
        </div>
        
        <div className="nav-links">
          <button className="nav-btn" onMouseEnter={handleNavHover}>RACING</button>
          <button className="nav-btn" onMouseEnter={handleNavHover}>SPORTS CARS</button>
          <button className="nav-btn" onMouseEnter={handleNavHover}>COLLECTIONS</button>
          <button className="nav-btn" onMouseEnter={handleNavHover}>EXPERIENCES</button>
          <button className="nav-btn" onMouseEnter={handleNavHover}>ABOUT US</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
