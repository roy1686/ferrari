import { useEffect, useRef, useState } from 'react';
import './LiveStats.css';

const statsData = [
  { label: 'HORSEPOWER', value: 1030, suffix: ' cv' },
  { label: '0-100 KM/H', value: 2.5, suffix: ' s', decimals: 1 },
  { label: 'TOP SPEED', value: 340, suffix: ' km/h' }
];

const LiveStats = () => {
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [counts, setCounts] = useState(statsData.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          import('../utils/SoundManager').then(m => m.SoundManager.play('full-rev', 0.15));
        }
      },
      { threshold: 0.5 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!inView) return;

    const duration = 2000;
    const frames = 60;
    const totalFrames = Math.round((duration / 1000) * frames);
    let frame = 0;

    const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    const counterInterval = setInterval(() => {
      frame++;
      const progress = easeOutExpo(frame / totalFrames);
      
      setCounts(statsData.map(stat => {
        const val = progress * stat.value;
        return stat.decimals ? val.toFixed(stat.decimals) : Math.round(val);
      }));

      if (frame >= totalFrames) {
        clearInterval(counterInterval);
        setCounts(statsData.map(stat => stat.value.toFixed(stat.decimals || 0)));
      }
    }, 1000 / frames);

    return () => clearInterval(counterInterval);
  }, [inView]);

  return (
    <section className="live-stats-section" ref={containerRef}>
      <div className="stats-grid">
        {statsData.map((stat, i) => (
          <div className="stat-block" key={i}>
            <div className="stat-value font-mono">
              {counts[i]}{stat.suffix}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LiveStats;
