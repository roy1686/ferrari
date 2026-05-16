import { useEffect, useState } from 'react';
import { triggerSparks } from '../utils/sparkBurst';
import logo from '../assets/logo.png';
import './CustomCursor.css';

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHoveringBtn, setIsHoveringBtn] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      const { clientX, clientY } = e;
      setPos({ x: clientX, y: clientY });
    };

    const handleMouseOver = (e) => {
      const isClickable = e.target.closest('button, a, .magnetic');
      setIsHoveringBtn(!!isClickable);
      
      // Magnetic button effect logic
      if (isClickable && isClickable.classList.contains('btn-primary')) {
         const rect = isClickable.getBoundingClientRect();
         const centerX = rect.left + rect.width / 2;
         const centerY = rect.top + rect.height / 2;
         const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
         
         if (dist < 60) {
           const strength = 0.3; // Intensity of magnetic pull
           const deltaX = (e.clientX - centerX) * strength;
           const deltaY = (e.clientY - centerY) * strength;
           isClickable.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
         } else {
           isClickable.style.transform = 'translate(0px, 0px)';
         }
      }
    };

    const handleClick = (e) => {
      const isClickable = e.target.closest('button, a, .magnetic');
      if (isClickable) {
        triggerSparks(e, Math.floor(Math.random() * 8) + 12);
        import('../utils/SoundManager').then(module => {
          module.SoundManager.play('paddle-shift', 0.13);
        });
      }
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousemove', handleMouseOver);
    window.addEventListener('mousedown', handleClick);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousemove', handleMouseOver);
      window.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <div className="custom-cursor-layer">
      {/* Main Logo Cursor */}
      <div 
        className={`cursor-crosshair ${isHoveringBtn ? 'hover-mode' : ''}`} 
        style={{ left: pos.x, top: pos.y }}
      >
        <img src={logo} alt="cursor" className="cursor-logo-img" />
      </div>
    </div>
  );
};

export default CustomCursor;
