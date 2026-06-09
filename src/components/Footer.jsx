import { useEffect, useRef, useState } from 'react';
import './Footer.css';
import { SoundManager } from '../utils/SoundManager';

const Footer = () => {
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          SoundManager.play('drive-away', 0.08);
          // Manually fade down to 0.03 simulating distance
          setTimeout(() => {
            const audio = SoundManager.sounds['drive-away'];
            if (audio) audio.volume = 0.03;
          }, 3000);
        }
      },
      { threshold: 0.2 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    
    return () => {
      if (footerRef.current) observer.unobserve(footerRef.current);
    };
  }, []);

  return (
    <footer className={`ferrari-footer ${isVisible ? 'fade-in-active' : ''}`} ref={footerRef}>
      <div className="footer-newsletter">
        <h2 className="newsletter-title font-serif">Newsletter</h2>
        <p className="newsletter-text">Stay up to date with the latest news from the world of Ferrari.</p>
        <button className="subscribe-btn magnetic">SUBSCRIBE</button>
      </div>

      <div className="footer-main-bg">
        <div className="footer-links-matrix">
          <div className="footer-column">
            <h3>RACING</h3>
            <ul>
              <li><a href="#">Scuderia Ferrari HP</a></li>
              <li><a href="#">SF-24</a></li>
              <li><a href="#">Charles Leclerc</a></li>
              <li><a href="#">Lewis Hamilton</a></li>
              <li><a href="#">Hypercar</a></li>
              <li><a href="#">GT Series</a></li>
              <li><a href="#">Esports</a></li>
              <li><a href="#">Scuderia Ferrari Driver Academy</a></li>
              <li><a href="#">Scuderia Ferrari Club</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>SPORTS CARS</h3>
            <ul>
              <li><a href="#">Range</a></li>
              <li><a href="#">Configure your Ferrari</a></li>
              <li><a href="#">MyFerrari</a></li>
              <li><a href="#">Pre-owned</a></li>
              <li><a href="#">Dealers</a></li>
              <li><a href="#">Recall information</a></li>
              <li><a href="#">TechInfo</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>COLLECTIONS</h3>
            <ul>
              <li><a href="#">Men</a></li>
              <li><a href="#">Women</a></li>
              <li><a href="#">Kids</a></li>
              <li><a href="#">Shoes</a></li>
              <li><a href="#">Eyewear</a></li>
              <li><a href="#">Collectibles</a></li>
              <li><a href="#">Scuderia Ferrari Selection</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>EXPERIENCES</h3>
            <ul>
              <li><a href="#">Corse Clienti</a></li>
              <li><a href="#">Ferrari Esports Series</a></li>
              <li><a href="#">Ristorante Cavallino</a></li>
              <li><a href="#">Ferrari Museums</a></li>
              <li><a href="#">Ferrari World Abu Dhabi</a></li>
              <li><a href="#">Ferrari Land Barcelona</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>ABOUT US</h3>
            <ul>
              <li><a href="#">Corporate</a></li>
              <li><a href="#">Sustainability</a></li>
              <li><a href="#">Media Centre</a></li>
              <li><a href="#">News</a></li>
              <li><a href="#">Magazine</a></li>
              <li><a href="#">History</a></li>
              <li><a href="#">Join us</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-socials">
          <div className="social-row">
            <a href="#" className="social-link"><span className="icon-placeholder fb-icon"></span>FACEBOOK <span>+</span></a>
            <a href="#" className="social-link"><span className="icon-placeholder ig-icon"></span>INSTAGRAM <span>+</span></a>
            <a href="#" className="social-link"><span className="icon-placeholder in-icon"></span>LINKEDIN <span>+</span></a>
            <a href="#" className="social-link"><span className="icon-placeholder tt-icon"></span>TIK TOK</a>
          </div>
          <div className="social-row">
            <a href="#" className="social-link"><span className="icon-placeholder tw-icon"></span>TWITCH</a>
            <a href="#" className="social-link"><span className="icon-placeholder x-icon"></span>X <span>+</span></a>
            <a href="#" className="social-link"><span className="icon-placeholder yt-icon"></span>YOUTUBE</a>
          </div>
        </div>

        <div className="footer-legal-text">
          <p>
            Ferrari N.V. - Holding company - A company under Dutch law, having its official seat in Amsterdam, the Netherlands and its corporate
            address at Via Abetone Inferiore No. 4, I-41053 Maranello (MO), Italy, registered with the Dutch trade register under number 64000200
          </p>
          <p>
            Ferrari S.p.A. - A company under Italian law, having its registered office at Via Emilia Est No. 1163, Modena, Italy, Companies' Register of
            Modena, VAT and Tax number 00155050360 and share capital of Euro 20,260,000
          </p>
          <p>Copyright 2026 - All rights reserved</p>
        </div>

        <div className="footer-accessibility-btn-container">
          <button className="accessibility-btn">
            <span className="human-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a2 2 0 100 4 2 2 0 000-4zM6 10h12M12 10v8M9 22l3-4 3 4"/></svg>
            </span>
            ACCESSIBILITY SETTINGS
          </button>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-bottom-links">
          <div className="link-group">
            <a href="#">Legal</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Preference Center</a>
            <a href="#">Accessibility</a>
            <a href="#">Submit your privacy request</a>
            <a href="#">Contacts</a>
            <a href="#">Corporate</a>
          </div>
          <div className="link-group mt-1">
            <a href="#">Responsible Disclosure</a>
            <a href="#">Reward Anticounterfeiting</a>
            <a href="#">Media Centre</a>
          </div>
        </div>
        <div className="footer-location">
          <button className="location-btn">INDIA <span className="arrow-up">^</span></button>
        </div>
      </div>

      <div className="footer-shell-border">
        {/* Placeholder for Shell logo */}
        <div className="shell-logo"></div>
      </div>

      <div 
        className="developer-signature font-mono" 
        style={{ 
          textAlign: 'center', 
          padding: '25px', 
          color: 'var(--gold)', 
          fontSize: '0.85rem', 
          letterSpacing: '3px', 
          borderTop: '1px solid rgba(255,255,255,0.05)', 
          backgroundColor: '#050505',
          textTransform: 'uppercase'
        }}
      >
        Created by Priyanka Priyadarshinee & Shubham Dash
      </div>
    </footer>
  );
};

export default Footer;
