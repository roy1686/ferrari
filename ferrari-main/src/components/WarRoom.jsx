import React, { useState, useEffect, useRef } from 'react';
import './WarRoom.css';
import { SoundManager } from '../utils/SoundManager';

const TELEMETRY = [
  { id: 'pts', label: 'Pts', value: 452, max: 500 },
  { id: 'wins', label: 'Wins', value: 4, max: 24 },
  { id: 'poles', label: 'Poles', value: 10, max: 24 },
  { id: 'laps', label: 'Laps', value: 1205, max: 2000 }
];

const RACES = [
  { id: 'bhr', name: 'BAHRAIN', circuit: 'Bahrain Int.', date: new Date(Date.now() - 864000000), flag: '🇧🇭', status: 'done' },
  { id: 'sau', name: 'SAUDI', circuit: 'Jeddah Corniche', date: new Date(Date.now() - 400000000), flag: '🇸🇦', status: 'done' },
  { id: 'ita', name: 'MONZA', circuit: 'Autodromo Mondiale', date: new Date(Date.now() + 450000000), flag: '🇮🇹', status: 'current' },
  { id: 'mon', name: 'MONACO', circuit: 'Circuit de Monaco', date: new Date(Date.now() + 850000000), flag: '🇲🇨', status: 'pending' },
  { id: 'usa', name: 'AUSTIN', circuit: 'COTA', date: new Date(Date.now() + 1500000000), flag: '🇺🇸', status: 'pending' }
];

const DRIVERS = [
  { 
    id: 16, name: 'Charles Leclerc', num: '16', flag: '🇲🇨', nat: 'Monégasque',
    wins: 5, podiums: 32, pts: 1140, races: 128,
    colors: { main: '#CC1200', accent: '#FFFFFF' }
  },
  { 
    id: 55, name: 'Carlos Sainz', num: '55', flag: '🇪🇸', nat: 'Spanish',
    wins: 2, podiums: 20, pts: 1042, races: 188,
    colors: { main: '#CC1200', accent: '#FFD700' }
  }
];

// Helper: CountUp Hook
const CountUp = ({ target, active }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) { setCount(0); return; }
    let startTimestamp = null;
    const duration = 1500;
    let req;

    const animate = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(target * easeOutExpo);
      if (progress < 1) req = requestAnimationFrame(animate);
    };
    req = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(req);
  }, [target, active]);

  return <span>{Math.floor(count)}</span>;
};

// Component: FlipNumber
const FlipNumber = ({ val, label, isPulse }) => {
  return (
    <div className={`flip-unit ${isPulse ? 'pulse-tick' : ''}`}>
      <div className="flip-val-wrapper">
        <div key={val} className="flip-anim font-mono">{val}</div>
      </div>
      <span className="font-mono">{label}</span>
    </div>
  );
};

const WarRoom = () => {
  const [activeRace, setActiveRace] = useState(RACES.find(r => r.status === 'current') || RACES[0]);
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });
  const [isRaceDay, setIsRaceDay] = useState(false);
  const [telemetryVisible, setTelemetryVisible] = useState(false);
  const [reanimateKey, setReanimateKey] = useState(0);

  const sectionRef = useRef(null);
  const teleRef = useRef(null);
  const stripRef = useRef(null);

  useEffect(() => {
    // Telemetry Observer
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTelemetryVisible(true);
      }
    }, { threshold: 0.5 });
    
    if (teleRef.current) observer.observe(teleRef.current);
    return () => { if (teleRef.current) observer.unobserve(teleRef.current); };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = activeRace.date.getTime() - now;
      
      if (distance <= 0) {
        setIsRaceDay(true);
        setTimeLeft({ d: '00', h: '00', m: '00', s: '00' });
      } else {
        setIsRaceDay(false);
        setTimeLeft({
          d: Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
          h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0'),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0'),
          s: Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0')
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeRace]);

  // Strip Drag Logic
  let isDown = false;
  let startX;
  let scrollLeft;

  const handleMouseDown = (e) => {
    isDown = true;
    if (stripRef.current) {
      stripRef.current.classList.add('active');
      startX = e.pageX - stripRef.current.offsetLeft;
      scrollLeft = stripRef.current.scrollLeft;
    }
  };
  const handleMouseLeave = () => { isDown = false; stripRef.current?.classList.remove('active'); };
  const handleMouseUp = () => { isDown = false; stripRef.current?.classList.remove('active'); };
  const handleMouseMove = (e) => {
    if (!isDown || !stripRef.current) return;
    e.preventDefault();
    const x = e.pageX - stripRef.current.offsetLeft;
    const walk = (x - startX) * 2; 
    stripRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTeleHover = () => {
    setReanimateKey(prev => prev + 1); // remounts to restart animations
  };

  return (
    <section className="war-room-elite" ref={sectionRef}>
      <div className="war-scanlines"></div>
      
      <div className="war-header">
        <h2 className="stencil-text hover-space">SCUDERIA FERRARI</h2>
        <div className="red-underline"></div>
      </div>

      <div className="war-grid">
        {/* DRIVERS: Pure CSS */}
        <div className="war-panel drivers-panel">
          <div className="panel-brackets"></div>
          <div className="panel-title font-mono">PILOTI - LINEUP 2026</div>
          <div className="drivers-container">
            {DRIVERS.map(d => (
              <div key={d.id} className="driver-card-3d">
                <div className="driver-heartbeat"></div>
                <div className="driver-card-inner">
                  {/* FRONT */}
                  <div className="driver-front">
                    <div className="helmet-css" style={{ '--hem-main': d.colors.main, '--hem-accent': d.colors.accent }}>
                       <div className="helmet-visor">
                          <div className="visor-reflection"></div>
                       </div>
                       <div className="helmet-stripe"></div>
                    </div>
                    <div className="d-info">
                       <span className="d-num font-mono">{d.num}</span>
                       <h3 className="font-serif">{d.name}</h3>
                       <span className="d-nat">{d.flag} {d.nat}</span>
                    </div>
                  </div>
                  {/* BACK */}
                  <div className="driver-back font-mono">
                    <div className="d-back-row"><span>Races</span> <CountUp target={d.races} active={true} /></div>
                    <div className="d-back-row"><span>Wins</span> <CountUp target={d.wins} active={true} /></div>
                    <div className="d-back-row"><span>Podiums</span> <CountUp target={d.podiums} active={true} /></div>
                    <div className="d-back-row highlighted"><span>Points</span> <CountUp target={d.pts} active={true} /></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COUNTDOWN */}
        <div className="war-panel countdown-panel">
          <div className="panel-brackets"></div>
          <div className="panel-title font-mono">
            NEXT DEPLOYMENT 
            <span className={`blinking-dot ${isRaceDay ? 'fast' : ''}`}></span>
          </div>
          
          <div className="race-target">
            <h3 className="font-serif hover-glow">GRAN PREMIO DEL {activeRace.name}</h3>
            <p className="font-mono">{activeRace.circuit} {activeRace.flag}</p>
          </div>

          {isRaceDay ? (
            <div className="race-day-flash font-serif">RACE DAY 🏁</div>
          ) : (
            <div className="flip-clock-container hover-shadow">
              <FlipNumber val={timeLeft.d} label="DAYS" />
              <FlipNumber val={timeLeft.h} label="HRS" />
              <FlipNumber val={timeLeft.m} label="MIN" />
              <FlipNumber val={timeLeft.s} label="SEC" isPulse={true} />
            </div>
          )}
        </div>

        {/* TELEMETRY */}
        <div className="war-panel stats-panel" ref={teleRef} onMouseEnter={handleTeleHover}>
          <div className="panel-brackets"></div>
          <div className="panel-title font-mono">LIVE TELEMETRY</div>
          
          <div className="stats-list font-mono" key={reanimateKey}>
            {TELEMETRY.map(item => (
              <div className="stat-row hover-shimmer" key={item.id}>
                <span className="stat-lbl">{item.label}</span>
                <div className="stat-bar">
                  <div 
                    className={`bar-fill ${telemetryVisible ? 'animating' : ''}`} 
                    style={{ '--target-w': `${(item.value / item.max) * 100}%` }}
                  >
                    <div className="shimmer-effect"></div>
                  </div>
                </div>
                <span className="stat-val"><CountUp target={item.value} active={telemetryVisible} /></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DRAGGABLE STRIP */}
      <div 
        className="war-calendar-strip font-mono" 
        ref={stripRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {RACES.map(race => (
          <div 
            key={race.id} 
            className={`cal-item ${race.status} ${activeRace.id === race.id ? 'active' : ''}`}
            onClick={() => {
              SoundManager.play('gear-click', 0.1);
              setActiveRace(race);
            }}
          >
            <span className="cal-flag">{race.flag}</span>
            <span className="cal-name">{race.name}</span>
            {race.status === 'current' && <span className="cal-pill"></span>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default WarRoom;
