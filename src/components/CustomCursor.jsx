import { useEffect, useState, useRef } from 'react';
import { triggerSparks } from '../utils/sparkBurst';
import logo from '../assets/logo.png';
import './CustomCursor.css';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100 });
  const [isHoveringBtn, setIsHoveringBtn] = useState(false);
  const [isHoveringInput, setIsHoveringInput] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      const { clientX, clientY } = e;
      posRef.current = { x: clientX, y: clientY };
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }
      
      // If we were typing and hiding the cursor, show it again on mouse movement
      setIsTyping((prev) => {
        if (prev) {
          document.body.classList.remove('typing-hide-cursor');
          return false;
        }
        return prev;
      });
    };

    const isInAskMeSection = (el) => {
      if (!el) return false;
      if (el.closest('.chat-close-btn')) return false;
      return !!el.closest('.ask-me-btn, .chat-drawer');
    };

    const handleMouseOver = (e) => {
      const inAskMe = isInAskMeSection(e.target);
      
      const isClickable = e.target.closest('button, a, .magnetic');
      setIsHoveringBtn(!!isClickable && inAskMe);
      
      const isInput = e.target.closest('input, textarea');
      setIsHoveringInput(!!isInput && inAskMe);
      
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

    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        setIsTyping(true);
        document.body.classList.add('typing-hide-cursor');
      }
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousemove', handleMouseOver);
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousemove', handleMouseOver);
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('typing-hide-cursor');
    };
  }, []);

  const isPointerActive = isHoveringBtn || isHoveringInput || isTyping;

  return (
    <div className="custom-cursor-layer">
      {/* Main Logo Cursor */}
      <div 
        ref={cursorRef}
        className={`cursor-crosshair ${isHoveringBtn ? 'hover-mode' : ''}`} 
        style={{ 
          transform: `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`,
          opacity: isPointerActive ? 0 : 1,
          visibility: isPointerActive ? 'hidden' : 'visible'
        }}
      >
        <img src={logo} alt="cursor" className="cursor-logo-img" />
      </div>
    </div>
  );
};

export default CustomCursor;
