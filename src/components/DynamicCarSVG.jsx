import React from 'react';

const DynamicCarSVG = ({ model, color, interior, idSuffix = 'def' }) => {
  // Use specific geometric adjustments if wanted, for now using a highly tuned hypercar profile
  // that adapts dynamically to the colors
  const paintTheme = color ? color.hex : '#CC1200';
  const intTheme = interior ? interior.hex : '#111111';
  const modelId = model ? model.id : '296gtb';

  const getChassisPath = (id) => {
    switch(id) {
      case 'sf90':
        // Extremely low hood, aggressive roof scoop/fin, large rear spoiler
        return `M 120 280 C 100 240, 180 210, 280 200 C 360 200, 420 120, 490 120 C 580 120, 680 150, 780 180 C 860 200, 930 180, 910 280 C 890 310, 150 320, 120 280 Z`;
      case '812':
        // Long hood (pulled forward), cabin shifted back
        return `M 100 270 C 80 230, 200 200, 310 195 C 420 195, 450 120, 530 120 C 630 120, 720 160, 800 180 C 880 200, 940 230, 900 280 C 880 310, 150 320, 100 270 Z`;
      case 'roma':
        // Smooth sweeping curves, retro-modern
        return `M 130 270 C 110 230, 160 210, 260 205 C 380 205, 420 130, 500 125 C 600 125, 710 180, 830 200 C 900 210, 940 250, 890 280 C 860 310, 150 320, 130 270 Z`;
      case '296gtb':
      default:
        // Original balanced mid-engine GTB shape
        return `M 120 270 C 100 230, 160 200, 240 200 C 340 200, 390 130, 480 125 C 580 120, 680 170, 780 190 C 880 210, 930 230, 900 280 C 880 310, 150 320, 120 270 Z`;
    }
  };

  const getGlassPath = (id) => {
    switch(id) {
      case 'sf90':
        // Cabin shifted slightly forward
        return `M 350 200 C 380 140, 460 125, 520 130 C 580 135, 650 160, 690 190 Q 600 200, 350 200 Z`;
      case '812':
        // Cabin shifted back
        return `M 430 195 C 460 135, 510 125, 560 130 C 620 135, 690 160, 720 190 Q 630 195, 430 195 Z`;
      case 'roma':
        // Sweeping glass
        return `M 400 205 C 430 145, 490 130, 540 135 C 600 140, 690 170, 730 195 Q 640 200, 400 205 Z`;
      case '296gtb':
      default:
        return `M 370 200 C 400 140, 460 130, 520 135 C 580 140, 650 170, 680 195 Q 600 205, 370 200 Z`;
    }
  };

  return (
    <svg 
       viewBox="0 0 1000 400" 
       fill="none" 
       xmlns="http://www.w3.org/2000/svg"
       className="dynamic-svg-car"
       style={{ width: '100%', height: '100%', display: 'block', padding: '0 2rem' }}
    >
      <defs>
        {/* Paint Gradient for realism */}
        <linearGradient id={`paintGrad-${idSuffix}`} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="30%" stopColor={paintTheme} stopOpacity="1" />
          <stop offset="70%" stopColor={paintTheme} stopOpacity="0.8" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
        </linearGradient>

        <linearGradient id={`paintDark-${idSuffix}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={paintTheme} stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0a0a0a" stopOpacity="1" />
        </linearGradient>

        <pattern id={`quilt-${idSuffix}`} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0,8 L16,8 M8,0 L8,16" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        </pattern>

        <linearGradient id={`glassGrad-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#111" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {/* Environment / Shadow Floor */}
      <ellipse cx="500" cy="350" rx="420" ry="12" fill="rgba(0,0,0,0.8)" filter="blur(8px)" />
      
      {/* Glowing reflection of the car paint on the floor */}
      <ellipse cx="500" cy="350" rx="350" ry="8" fill={paintTheme} filter="blur(15px)" opacity="0.3" />

      {/* Wheels Base */}
      <circle cx="240" cy="300" r="50" fill="#050505" />
      <circle cx="750" cy="300" r="54" fill="#050505" />

      {/* Car Interior Elements (Visible through glass) */}
      <g className="interior-layer">
        <path 
           d="M 440 230 Q 430 170 470 160 L 530 160 Q 540 190 560 230 Z" 
           fill={intTheme} 
           stroke="#000" strokeWidth="2" 
        />
        <path 
           d="M 440 230 Q 430 170 470 160 L 530 160 Q 540 190 560 230 Z" 
           fill={`url(#quilt-${idSuffix})`} 
        />
        {/* Steering Wheel silhouette */}
        <ellipse cx="400" cy="200" rx="5" ry="15" fill="#111" transform="rotate(20 400 200)" />
      </g>

      {/* Base Car Chassis Body Outline */}
      <path 
         d={getChassisPath(modelId)} 
         fill={`url(#paintGrad-${idSuffix})`} 
      />

      {/* Glass & Cabin */}
      <path 
         d={getGlassPath(modelId)}
         fill={`url(#glassGrad-${idSuffix})`}
         stroke={`url(#paintDark-${idSuffix})`} strokeWidth="4"
      />

      {/* Glossy Highlights / Aerodynamics */}
      <path 
         d="M 280 250 C 400 230, 500 260, 700 230" 
         stroke="rgba(0,0,0,0.5)" strokeWidth="6" fill="none" filter="blur(2px)" 
      />
      <path 
         d="M 280 248 C 400 228, 500 258, 700 228" 
         stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" 
      />

      {/* Wheel Arches painted cutout effect */}
      <path d="M 180 300 A 60 60 0 0 1 300 300" stroke="#000" strokeWidth="8" fill="none" />
      <path d="M 183 300 A 57 57 0 0 1 297 300" stroke={`url(#paintGrad-${idSuffix})`} strokeWidth="2" fill="none" />
      
      <path d="M 686 300 A 64 64 0 0 1 814 300" stroke="#000" strokeWidth="10" fill="none" />
      <path d="M 691 300 A 59 59 0 0 1 809 300" stroke={`url(#paintGrad-${idSuffix})`} strokeWidth="2" fill="none" />

      {/* Alloys */}
      <circle cx="240" cy="300" r="32" fill="none" stroke="#666" strokeWidth="5" strokeDasharray="10 12" />
      <circle cx="240" cy="300" r="10" fill="#222" />
      
      <circle cx="750" cy="300" r="36" fill="none" stroke="#666" strokeWidth="6" strokeDasharray="12 14" />
      <circle cx="750" cy="300" r="12" fill="#222" />
      
      {/* Brake Calipers matched to car paint */}
      <path d="M 215 300 A 25 25 0 0 1 240 275" stroke={paintTheme} strokeWidth="5" fill="none" />
      <path d="M 720 300 A 30 30 0 0 1 750 270" stroke={paintTheme} strokeWidth="6" fill="none" />

      {/* Details (Headlight, Taillight, Exhaust) */}
      <path d="M 110 290 Q 150 300 180 300" stroke="#111" strokeWidth="6" fill="none" /> 
      {/* Headlight beam */}
      <path d="M 160 210 L 200 205" stroke="#fff" strokeWidth="4" filter="drop-shadow(0 0 6px #fff)" fill="none" />
      <path d="M 80 220 L 160 210" stroke="rgba(255,255,255,0.4)" strokeWidth="8" filter="blur(4px)" fill="none" /> 
      {/* Tail light cluster */}
      <circle cx="890" cy="225" r="4" fill="#ff2800" filter="drop-shadow(0 0 8px #ff2800)" />
      {/* Exhaust */}
      <path d="M 895 270 L 910 270" stroke="#333" strokeWidth="6" fill="none" />
      
    </svg>
  );
};

export default DynamicCarSVG;
