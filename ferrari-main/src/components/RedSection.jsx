import { useState, useEffect } from 'react';
import './RedSection.css';

import marathonImg from '../assets/marathon.jpg';
import liveryImg from '../assets/livery.jpg';
import charlesImg from '../assets/charles.jpg';

// Fallback for Behind the Vision since no local asset was provided
const behindVisionImg = 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=1200';

const newsItems = [
  {
    title: "BEHIND THE VISION",
    description: "An inside look at the creative and production process shaping the new Ferrari Luce, captured in a film series told from a perspective rarely explored",
    image: behindVisionImg,
  },
  {
    title: "ITALY HALF MARATHON 2026: 15,000 REGISTERED RUNNERS",
    description: "In a weekend that will remain etched in the memories of thousands of participants and spectators, the 2026 edition of the Italy Half Marathon - Enzo Ferrari Memorial has come to a close.",
    image: marathonImg,
  },
  {
    title: "CHARLES DELIVERS ANOTHER PODIUM FOR THE SCUDERIA",
    description: "Scuderia Ferrari HP leaves Japan with a third podium from as many races, thanks to a third place finish from Charles Leclerc.",
    image: charlesImg,
  },
  {
    title: "FERRARI UNVEILS 2026 LIVERY OF 499P SET TO DEFEND FIA WEC WORLD TITLES",
    description: "Ferrari has officially launched the 2026 season, which will see the Prancing Horse return to the FIA World Endurance Championship to defend the Manufacturers' and Drivers' world titles secured in an unforgettable and already historic 2025 campaign.",
    image: liveryImg,
  }
];

const RedSection = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % newsItems.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  };

  const currentNews = newsItems[current];

  return (
    <section className="news-section">
      <div className="news-top-tracker">
        <div className="tracker-dots">
          {newsItems.map((_, index) => (
            <div 
              key={index} 
              className={`tracker-dot ${index === current ? 'active' : ''}`}
              onClick={() => setCurrent(index)}
              style={{ cursor: 'pointer' }}
            ></div>
          ))}
        </div>
        <div className="tracker-line"></div>
        <a href="#" className="view-all-news-link">VIEW ALL NEWS</a>
      </div>

      <button className="nav-arrow prev" onClick={prevSlide}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      
      <div className="news-container">
        <div className="news-content-area">
          <div className="news-text" key={`text-${current}`}>
            <h2 className="news-headline">{currentNews.title}</h2>
            <p className="news-body">{currentNews.description}</p>
            <button className="read-more-btn">
              <span>READ MORE</span>
              <div className="arrow-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </button>
          </div>
        </div>
        
        <div className="news-image-area">
          <div className="news-image-wrapper">
            <img 
              src={currentNews.image} 
              alt={currentNews.title} 
              className="news-img" 
              key={`img-${current}`}
            />
          </div>
        </div>
      </div>
      
      <button className="nav-arrow next" onClick={nextSlide}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </section>
  );
};

export default RedSection;
