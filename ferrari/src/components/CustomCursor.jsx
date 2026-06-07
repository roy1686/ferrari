import { useEffect } from 'react';
import { triggerSparks } from '../utils/sparkBurst';
import logo from '../assets/logo.png';
import './CustomCursor.css';

const generateCursorDataUrl = (imgSrc, color, size) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imgSrc;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const aspect = img.height / img.width;
      const width = size;
      const height = Math.round(size * aspect);
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // Tint the image to the specified color
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);
      
      resolve(canvas.toDataURL());
    };
    img.onerror = () => {
      resolve(null);
    };
  });
};

const CustomCursor = () => {
  useEffect(() => {
    const initCursors = async () => {
      const normalUrl = await generateCursorDataUrl(logo, '#FFFFFF', 24);
      const hoverUrl = await generateCursorDataUrl(logo, '#CC1200', 32);

      if (normalUrl && hoverUrl) {
        const img = new Image();
        img.src = logo;
        img.onload = () => {
          const aspect = img.height / img.width;
          const normalHeight = Math.round(24 * aspect);
          const hoverHeight = Math.round(32 * aspect);
          
          const normalHotspotX = 12;
          const normalHotspotY = Math.round(normalHeight / 2);
          
          const hoverHotspotX = 16;
          const hoverHotspotY = Math.round(hoverHeight / 2);

          document.documentElement.style.setProperty('--custom-cursor-normal', `url(${normalUrl}) ${normalHotspotX} ${normalHotspotY}, auto`);
          document.documentElement.style.setProperty('--custom-cursor-hover', `url(${hoverUrl}) ${hoverHotspotX} ${hoverHotspotY}, auto`);
        };
      }
    };

    initCursors();

    const handleMouseMove = (e) => {
      if (document.body.classList.contains('typing-hide-cursor')) {
        document.body.classList.remove('typing-hide-cursor');
      }
      
      const isClickable = e.target.closest('button, a, .magnetic');
      if (isClickable && isClickable.classList.contains('btn-primary')) {
         const rect = isClickable.getBoundingClientRect();
         const centerX = rect.left + rect.width / 2;
         const centerY = rect.top + rect.height / 2;
         const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
         
         if (dist < 60) {
           const strength = 0.3;
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
        document.body.classList.add('typing-hide-cursor');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('typing-hide-cursor');
    };
  }, []);

  return null; // CSS native cursor, no DOM element needed
};

export default CustomCursor;
