import React, { useEffect, useRef } from 'react';
import './HeritageTimeline.css';
import { SoundManager } from '../utils/SoundManager';

import img1 from '../assets/the_genesis.jpeg';
import img2 from '../assets/museums.jpeg';
import img3 from '../assets/hero1.jpeg';
import img4 from '../assets/Enzo ferrari.jpg';
import imgLaFerrari from '../assets/laferrari.jpeg';
import imgTheFuture from '../assets/thefuture (1).jpeg';
import img125s from '../assets/125s.jpg';

const timelineData = [
  { year: 1947, title: 'The Genesis', desc: 'The first Ferrari, the 125 S, fires up its engine.', img: img1 },
  { year: 1952, title: 'First F1 Win', desc: 'Alberto Ascari secures the first World Championship.', img: img2 },
  { year: 1987, title: 'Defining the F40', desc: 'Built to celebrate Ferrari’s 40th anniversary.', img: img3 },
  { year: 2002, title: 'The Enzo Era', desc: 'A hypercar tribute to the founder himself.', img: img4 },
  { year: 2013, title: 'LaFerrari', desc: 'The first hybrid delivering 963 cv.', img: imgLaFerrari },
  { year: 2026, title: 'The Future', desc: 'Electrification bound with pure Ferrari DNA.', img: imgTheFuture }
];

const HeritageTimeline = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            SoundManager.play('gear-click', 0.05);
          }
        });
      },
      { threshold: 0.3 }
    );

    const elements = document.querySelectorAll('.ht-card');
    elements.forEach(el => observer.observe(el));

    return () => elements.forEach(el => observer.unobserve(el));
  }, []);

  return (
    <section className="heritage-vertical-section" ref={containerRef}>
      <div className="ht-scanlines"></div>
      
      <div className="ht-header">
        <h2 className="font-serif">FERRARI HERITAGE</h2>
        <p className="ht-subtitle font-mono">EIGHT DECADES OF MOTORSPORT DOMINANCE</p>
        <div className="ht-underline"></div>
      </div>
      
      <div className="ht-container">
        <div className="ht-line">
           <div className="ht-line-glow"></div>
        </div>
        
        {timelineData.map((item, index) => (
          <div className={`ht-card ${index % 2 === 0 ? 'left' : 'right'}`} key={index}>
            <div className="ht-node fade-target font-mono">
               <span className="ht-node-year">{item.year}</span>
            </div>
            
            <div className="ht-content fade-target">
              <div className="ht-img-wrapper">
                <img src={item.img} alt={item.title} />
                <div className="ht-overlay"></div>
                <div className="ht-badge font-mono">{item.year}</div>
              </div>
              <div className="ht-text-block">
                 <h3 className="ht-title font-serif">{item.title}</h3>
                 <p className="ht-desc">{item.desc}</p>
                 <button className="ht-learn-more font-mono">EXPLORE ERA &rarr;</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeritageTimeline;
