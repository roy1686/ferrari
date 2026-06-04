import { useRef, useState, useEffect } from 'react';
import './Showcase.css';
import { SoundManager } from '../utils/SoundManager';
import collectionsImg from '../assets/New collection.jpg';
import greatestHitsImg from '../assets/Ferrari Greatest Hits.jpg';
import magazineImg from '../assets/magazine.jpg';
import preownedImg from '../assets/preowned.jpg';
import replica2026Img from '../assets/replica2026.jpg';
import pastModelsImg from '../assets/Past model farrari.avif';

const showcaseItems = [
  {
    category: 'Collections',
    title: 'NEW ARRIVALS',
    image: collectionsImg,
    linkText: 'DISCOVER'
  },
  {
    category: 'Ferrari Museums',
    title: 'GREATEST HITS',
    image: greatestHitsImg,
    linkText: 'DISCOVER'
  },
  {
    category: 'Magazine',
    title: 'RESTORED, JUST AS RICHIE RACED IT',
    image: magazineImg,
    linkText: 'DISCOVER'
  },
  {
    category: 'Scuderia Ferrari',
    title: 'REPLICA 2026',
    image: replica2026Img,
    linkText: 'DISCOVER'
  },
  {
    category: 'Ferrari Approved',
    title: 'PRE-OWNED',
    image: preownedImg,
    linkText: 'DISCOVER'
  },
  {
    category: 'Sports Cars',
    title: 'PAST MODELS',
    image: pastModelsImg,
    linkText: 'DISCOVER'
  }
];

const Showcase = () => {
  const containerRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const lastIndex = useRef(0);

  const handleScroll = (e) => {
    const el = e.target;
    // Calculate approximate active item based on typical width
    const itemWidth = window.innerWidth > 768 ? window.innerWidth * 0.4 : window.innerWidth * 0.8;
    const index = Math.round(el.scrollLeft / itemWidth);
    if (index !== lastIndex.current && index >= 0) {
      lastIndex.current = index;
      SoundManager.play('tire-chirp', 0.10);
    }
  };

  const startDrag = (e) => {
    setIsDown(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const drag = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed multiplier
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const endDrag = () => {
    setIsDown(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let targetScroll = container.scrollLeft;
    let currentScroll = container.scrollLeft;
    let isScrolling = false;
    let animationFrameId;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const smoothScroll = () => {
      currentScroll = lerp(currentScroll, targetScroll, 0.08);
      container.scrollLeft = currentScroll;

      if (Math.abs(targetScroll - currentScroll) > 0.5) {
        animationFrameId = requestAnimationFrame(smoothScroll);
      } else {
        isScrolling = false;
        container.scrollLeft = targetScroll;
      }
    };

    const handleWheelNative = (e) => {
      if (Math.abs(e.deltaY) > 0 || Math.abs(e.deltaX) > 0) {
        e.preventDefault();
        
        if (!isScrolling) {
          targetScroll = container.scrollLeft;
          currentScroll = container.scrollLeft;
        }

        const scrollAmount = e.deltaY * 1.5 + e.deltaX * 1.5;
        targetScroll += scrollAmount;
        
        const maxScroll = container.scrollWidth - container.clientWidth;
        targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

        if (!isScrolling) {
          isScrolling = true;
          animationFrameId = requestAnimationFrame(smoothScroll);
        }
      }
    };

    container.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheelNative);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="showcase-section" id="showcase">
      <div 
        className={`showcase-gallery-container ${isDown ? 'active' : ''}`}
        ref={containerRef}
        onMouseDown={startDrag}
        onMouseLeave={endDrag}
        onMouseUp={endDrag}
        onMouseMove={drag}
        onScroll={handleScroll}
      >
        <div className="showcase-flex">
          {showcaseItems.map((item, index) => (
            <div className="showcase-block magnetic" key={index}>
              <div 
                className="showcase-background" 
                style={{ 
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: item.backgroundSize || 'cover'
                }}
              ></div>
              <div className="showcase-overlay"></div>
              <div className="showcase-content">
                <div className="content-inner">
                  <h4 className="showcase-category">{item.category}</h4>
                  <h2 className="showcase-title font-serif">{item.title}</h2>
                  <a href="#" className="showcase-discover btn-primary magnetic">
                    <span>{item.linkText}</span>
                    <div className="discover-arrow">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Showcase;
