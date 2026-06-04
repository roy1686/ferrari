import { useState, useRef, useEffect } from 'react';
import './EngineSymphony.css';
import { SoundManager } from '../utils/SoundManager';

const engines = [
  { id: 'f40', name: 'F40', spec: 'V8 Turbo', year: '1987', color: '#8a0e00', rpm: 7750, sound: 'engine-start' },
  { id: 'f50', name: 'F50', spec: 'V12 Naturally Aspirated', year: '1995', color: '#a61300', rpm: 8500, sound: 'idle-loop' },
  { id: '458', name: '458 Italia', spec: 'V8 High-Rev', year: '2009', color: '#cc1200', rpm: 9000, sound: 'v8-growl' },
  { id: 'laferrari', name: 'LaFerrari', spec: 'V12 Hybrid', year: '2013', color: '#e61400', rpm: 9250, sound: 'full-rev' },
  { id: '812', name: '812 Superfast', spec: 'V12 6.5L', year: '2017', color: '#ff1a00', rpm: 8900, sound: 'v12-roar' }
];

const EngineSymphony = () => {
  const [activeEngine, setActiveEngine] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRpm, setCurrentRpm] = useState(0);

  const containerRef = useRef(null);

  const handlePlayEngine = (engine) => {
    // If clicking same engine while playing, stop it
    if (activeEngine?.id === engine.id && isPlaying) {
      SoundManager.stop(engine.sound);
      setIsPlaying(false);
      setCurrentRpm(0);
      return;
    }

    // Stop current
    if (activeEngine && isPlaying) {
      SoundManager.stop(activeEngine.sound);
    }

    setActiveEngine(engine);
    setIsPlaying(true);
    SoundManager.play(engine.sound, 0.20);
    
    // Rev animation
    setCurrentRpm(0);
    setTimeout(() => {
      setCurrentRpm(engine.rpm);
      
      // Add redline shake class to container momentarily
      if (containerRef.current) {
        setTimeout(() => {
          containerRef.current.classList.add('redline-shake');
          setTimeout(() => containerRef.current.classList.remove('redline-shake'), 500);
        }, 800); // sync with rpm needle finish roughly
      }
    }, 100);
  };

  return (
    <section 
      className="engine-symphony-section" 
      ref={containerRef}
      style={{ '--active-color': activeEngine ? activeEngine.color : 'var(--carbon)' }}
    >
      <div className="symphony-bg-overlay"></div>
      
      <div className="symphony-header">
        <h2 className="font-serif">THE SYMPHONY</h2>
        <p className="symphony-subtitle">Experience the unmistakable acoustic signatures</p>
      </div>

      <div className="symphony-visualizer">
        {/* RPM Gauge */}
        <div className="rpm-gauge">
          <svg viewBox="0 0 200 100" className="gauge-svg">
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" strokeLinecap="round" />
            <path 
              d="M 20 100 A 80 80 0 0 1 180 100" 
              fill="none" 
              stroke="var(--ferrari-red)" 
              strokeWidth="10" 
              strokeLinecap="round" 
              strokeDasharray="251" 
              strokeDashoffset={251 - (currentRpm / 10000) * 251}
              className="gauge-progress"
            />
          </svg>
          <div className="rpm-value font-mono">
            <span>{currentRpm > 0 ? (currentRpm / 1000).toFixed(1) : '0'}</span>
            <small>x1000 RPM</small>
          </div>
        </div>

        {/* Waveform visualizer */}
        <div className={`waveform-container ${isPlaying ? 'active' : ''}`}>
          {Array(24).fill(0).map((_, i) => (
            <div key={i} className="wave-bar" style={{ 
              height: isPlaying ? `${Math.random() * 80 + 20}%` : '5px',
              animationDelay: `${i * 0.05}s`
            }}></div>
          ))}
        </div>
        
        {/* Engine Specs */}
        <div className={`engine-specs font-mono ${activeEngine ? 'visible' : ''}`}>
          <div className="spec-item">
            <span className="spec-label">MODEL</span>
            <span className="spec-value">{activeEngine?.name}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">TYPE</span>
            <span className="spec-value">{activeEngine?.spec}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">YEAR</span>
            <span className="spec-value">{activeEngine?.year}</span>
          </div>
        </div>
      </div>

      <div className="engine-keyboard">
        {engines.map((engine) => (
          <button 
            key={engine.id}
            className={`engine-key magnetic ${activeEngine?.id === engine.id && isPlaying ? 'playing' : ''}`}
            onClick={() => handlePlayEngine(engine)}
          >
            <span className="key-year font-mono">{engine.year}</span>
            <span className="key-name font-serif">{engine.name}</span>
            <div className="key-glow" style={{ backgroundColor: engine.color }}></div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default EngineSymphony;
