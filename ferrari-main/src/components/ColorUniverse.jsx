import { useState, useRef, useEffect } from 'react';
import './ColorUniverse.css';

const colors = [
  { name: 'Rosso Corsa', hex: '#FF2800' },
  { name: 'Giallo Modena', hex: '#FFD700' },
  { name: 'Nero Daytona', hex: '#1a1a1a' },
  { name: 'Blu Tour de France', hex: '#003399' },
  { name: 'Bianco Avus', hex: '#F5F5F5' },
  { name: 'Verde Medio', hex: '#2d5a1b' },
  { name: 'Argento Nürburgring', hex: '#C0C0C0' },
  { name: 'Rosso Fiorano', hex: '#CC1200' },
  { name: 'Arancio', hex: '#FF6B00' },
  { name: 'Blu Pozzi', hex: '#1B3A6B' },
  { name: 'Grigio Silverstone', hex: '#808080' },
  { name: 'Marrone Saddle', hex: '#8B4513' }
];

const ColorUniverse = () => {
  const [hoveredColor, setHoveredColor] = useState(null);
  const [activeColor, setActiveColor] = useState('#FF2800'); // default

  // Inject into root if they click, so it persists across page if we want, but for now we'll just handle it locally
  const handleSelectColor = (hex) => {
    setActiveColor(hex);
    document.documentElement.style.setProperty('--ferrari-red', hex);
  };

  const bgToUse = hoveredColor ? hoveredColor.hex : activeColor;

  return (
    <section className="color-universe-section" style={{ '--dynamic-bg': bgToUse }}>
      <div className="color-bg-wash"></div>
      
      {/* Car Silhouette Overlay that matches selected color */}
      <div className="color-car-silhouette" style={{ 
        opacity: hoveredColor ? 1 : 0.3,
        maskImage: 'url(/icons.svg#car-mask)', /* approximate, using CSS filters otherwise */
      }}>
        <svg viewBox="0 0 800 300" className="car-svg">
           {/* Abstract minimalist sports car shape */}
           <path d="M 50,200 Q 150,150 250,150 L 400,100 Q 550,100 650,180 Q 750,230 780,250 L 50,250 Z" 
                 fill={bgToUse} style={{ filter: 'brightness(1.5) drop-shadow(0 0 30px rgba(0,0,0,0.5))'}} />
        </svg>
      </div>

      <div className="color-universe-content">
        <h2 className="color-universe-title font-serif">CHOOSE YOUR SOUL</h2>
        
        <div className="color-orb-grid">
          {colors.map((color, idx) => (
            <div 
              key={idx}
              className={`color-orb-container ${hoveredColor?.name === color.name ? 'orb-hovered' : ''}`}
              onMouseEnter={() => setHoveredColor(color)}
              onMouseLeave={() => setHoveredColor(null)}
              onClick={() => handleSelectColor(color.hex)}
            >
              <div 
                className="color-orb magnetic"
                style={{ backgroundColor: color.hex }}
              >
                <div className="shimmer"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="color-details font-mono">
          <div className="color-name">{hoveredColor ? hoveredColor.name : 'Hover to preview'}</div>
          <div className="color-hex">{hoveredColor ? hoveredColor.hex : ''}</div>
        </div>
      </div>
    </section>
  );
};

export default ColorUniverse;
