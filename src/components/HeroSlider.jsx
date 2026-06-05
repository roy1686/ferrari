import { useState, useEffect, useRef } from 'react';
import './HeroSlider.css';
import { SoundManager } from '../utils/SoundManager';

import video1 from '../assets/video1.mp4';
import video2 from '../assets/video2.mp4';
import video3 from '../assets/video3.mp4';

const slides = [
  {
    video: video1,
    label: 'Racing',
    title: 'SCUDERIA FERRARI',
   
  },
  {
    video: video2,
    label: 'Sports cars',
    title: 'START YOUR ENGINE',
   
  },
  {
    video: video3,
    label: 'Collections',
    title: 'NEW ARRIVAL',

  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [blurAmount, setBlurAmount] = useState(0);
  const timerRef = useRef(null);
  const videoRefs = useRef([]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  useEffect(() => {
    timerRef.current = setInterval(nextSlide, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Speed-reactive motion blur logic
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const delta = Math.abs(currentScrollY - lastScrollY);
          
          // Apply velocity coefficient and cap it
          const blur = Math.min(delta * 0.15, 10);
          setBlurAmount(blur);
          
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    const decayInterval = setInterval(() => {
      setBlurAmount(prev => {
        if (prev <= 0.2) return 0;
        return prev * 0.85; // smooth friction
      });
    }, 50);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(decayInterval);
    };
  }, []);

  useEffect(() => {
    // Play the current video immediately
    const activeVideo = videoRefs.current[current];
    if (activeVideo) {
      activeVideo.currentTime = 0;
      activeVideo.play().catch(e => console.log("Auto-play blocked or error:", e));
    }

    // Delay pausing the other videos until the 1s transition completes
    const timeoutId = setTimeout(() => {
      videoRefs.current.forEach((video, index) => {
        if (video && index !== current) {
          video.pause();
        }
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [current]);

  const handleDotClick = (index) => {
    if (current === index || isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 1000);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(nextSlide, 5000);
  };

  return (
    <section className="hero-slider">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === current ? 'active' : ''} ${
            index === (current === 0 ? slides.length - 1 : current - 1) ? 'prev' : ''
          }`}
          onMouseEnter={() => SoundManager.play('v8-growl', 0.09)}
        >
          <video
            ref={el => videoRefs.current[index] = el}
            className="slide-video"
            src={slide.video}
            muted
            loop
            playsInline
            style={{ 
              filter: `blur(${blurAmount}px)`, 
              transform: `scale(${(index === 0 ? 1.35 : 1) + blurAmount * 0.005})` 
            }}
          />
          <div className="overlay"></div>
          
          <div className="slide-content">
            <span className="slide-label">{slide.label}</span>
            <h1 className="slide-title font-serif">{slide.title}</h1>
            <p className="slide-description">{slide.description}</p>
            <button className="btn-primary">DISCOVER</button>
          </div>
        </div>
      ))}

      <div className="slider-dots">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === current ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
