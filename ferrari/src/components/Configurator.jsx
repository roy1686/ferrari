import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { SoundManager } from '../utils/SoundManager';
import './Configurator.css';

const MODELS = [
  { id: 'sf90', name: 'SF90 Stradale', hp: 1000, accel: 2.5 },
  { id: '296gtb', name: '296 GTB', hp: 830, accel: 2.9 },
  { id: '812', name: '812 Superfast', hp: 800, accel: 2.9 },
  { id: 'roma', name: 'Roma', hp: 620, accel: 3.4 }
];

const COLORS = [
  { id: 'rosso', name: 'Rosso Corsa', hex: '#CC1200' },
  { id: 'giallo', name: 'Giallo Modena', hex: '#FFD700' },
  { id: 'nero', name: 'Nero Daytona', hex: '#1a1a1a' },
  { id: 'bianco', name: 'Bianco Avus', hex: '#F5F5F5' },
  { id: 'blu', name: 'Blu Pozzi', hex: '#1B3A6B' },
  { id: 'verde', name: 'Verde Medio', hex: '#2d5a1b' },
  { id: 'arancio', name: 'Arancio', hex: '#FF6B00' },
  { id: 'argento', name: 'Argento Nurburgring', hex: '#C0C0C0' }
];

const INTERIORS = [
  { id: 'nero', name: 'Nero', hex: '#111111', quote: 'Built for the track' },
  { id: 'cuoio', name: 'Cuoio', hex: '#8B5A2B', quote: 'Built for the journey' },
  { id: 'rosso', name: 'Rosso', hex: '#CC1200', quote: 'Built for the legend' }
];


import SF90Rotator from './SF90Rotator';

// Helper: Custom CountUp Component
const CountUp = ({ target, suffix = '', decimals = 0, active }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let startTimestamp = null;
    const duration = 1200;
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

  return <span>{count.toFixed(decimals)}{suffix}</span>;
};

// Helper: Magnetic Button
const MagneticButton = ({ children, onClick, className = '', disabled = false, type = 'button' }) => {
  const btnRef = useRef(null);
  const rectRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e) => {
    if (disabled || window.innerWidth < 768 || !btnRef.current) return; 
    let rect = rectRef.current;
    if (!rect) {
      rect = btnRef.current.getBoundingClientRect();
      rectRef.current = rect;
    }
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const x = clientX - rect.left - rect.width / 2;
      const y = clientY - rect.top - rect.height / 2;
      btnRef.current.style.transition = 'transform 0s';
      btnRef.current.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (btnRef.current) {
      btnRef.current.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
      btnRef.current.style.transform = `translate(0px, 0px)`;
    }
  };

  return (
    <button
      ref={btnRef} type={type}
      className={`mag-btn ${className}`}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      onClick={onClick} disabled={disabled}
    >
      {children}
    </button>
  );
};

const Configurator = () => {
  const [step, setStep] = useState(1);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedInterior, setSelectedInterior] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Custom Demo specific states
  const [isDemoSubmitted, setIsDemoSubmitted] = useState(false);
  const [imgError, setImgError] = useState(false);

  // 3D Card interactive refs
  const cardRefs = useRef([]);
  if (cardRefs.current.length !== MODELS.length) {
    cardRefs.current = Array(MODELS.length).fill().map((_, i) => cardRefs.current[i] || React.createRef());
  }

  const rectsRef = useRef({});
  const cardAnimationFrameRef = useRef({});

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(cardAnimationFrameRef.current).forEach(id => cancelAnimationFrame(id));
    };
  }, []);

  const handleCardMove = (e, modelId, targetRef, isSelected) => {
    if (window.innerWidth < 768 || isSelected) return; 
    const el = targetRef.current;
    if (!el) return;
    
    let rect = rectsRef.current[modelId];
    if (!rect) {
      rect = el.getBoundingClientRect();
      rectsRef.current[modelId] = rect;
    }
    
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    if (cardAnimationFrameRef.current[modelId]) {
      cancelAnimationFrame(cardAnimationFrameRef.current[modelId]);
    }
    
    cardAnimationFrameRef.current[modelId] = requestAnimationFrame(() => {
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      
      el.style.transition = 'transform 0s';
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      const glare = el.querySelector('.card-glare');
      if (glare) {
        glare.style.opacity = 1;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.4) 0%, transparent 60%)`;
      }
    });
  };

  const handleCardLeave = (modelId, targetRef, isSelected) => {
    delete rectsRef.current[modelId];
    if (cardAnimationFrameRef.current[modelId]) {
      cancelAnimationFrame(cardAnimationFrameRef.current[modelId]);
      delete cardAnimationFrameRef.current[modelId];
    }
    
    if (isSelected) return;
    const el = targetRef.current;
    if (el) {
      el.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
      const glare = el.querySelector('.card-glare');
      if (glare) glare.style.opacity = 0;
    }
  };

  const nextStep = () => {
    SoundManager.play('turbo-whoosh', 0.08);
    if (step < 3) {
      setStep(step + 1);
    } else {
      completeConfig();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      SoundManager.play('turbo-whoosh', 0.08);
      setStep(step - 1);
      setIsCompleted(false);
      setIsDemoSubmitted(false);
    }
  };

  const completeConfig = () => {
    setIsCompleted(true);
    SoundManager.play('paddle-shift', 0.08);
    
    // Triple Confetti Logic
    setTimeout(() => {
      const colors = ['#CC1200', '#C9A84C'];
      confetti({ particleCount: 100, spread: 70, origin: { x: 0.2, y: 0.6 }, colors, zIndex: 9999 });
      setTimeout(() => confetti({ particleCount: 100, spread: 70, origin: { x: 0.8, y: 0.6 }, colors, zIndex: 9999 }), 300);
      setTimeout(() => confetti({ particleCount: 150, spread: 100, origin: { x: 0.5, y: 0.4 }, colors, zIndex: 9999 }), 600);
    }, 100);
  };

  const submitDemo = (e) => {
    e.preventDefault();
    SoundManager.play('paddle-shift', 0.1);
    setIsDemoSubmitted(true);
    setTimeout(() => {
       confetti({ particleCount: 100, spread: 120, origin: { y: 0.6 }, colors: ['#C9A84C'], zIndex: 9999 });
    }, 300);
  };

  const renderPlaceholder = () => (
    <div className="img-placeholder" style={{ background: `linear-gradient(135deg, ${selectedColor.hex}, #111)`}}>
       <h3>{selectedModel?.name}</h3>
       <span>{selectedColor?.name}</span>
    </div>
  );

  return (
    <section className="configurator-elite">
      {!isCompleted && (
        <div className="conf-header">
          <h2 className="title font-serif">CONFIGURE YOUR FERRARI</h2>
          <div className="progress-wrapper">
            <div className={`prog-step ${step >= 1 ? 'active' : ''}`}>01 MODEL</div>
            <div className={`prog-step ${step >= 2 ? 'active' : ''}`}>02 COLOUR</div>
            <div className={`prog-step ${step === 3 ? 'active' : ''}`}>03 INTERIOR</div>
            <div className="prog-line">
              <div className="prog-fill" style={{ width: `${(step - 1) * 50}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {/* --- STEPS --- */}
      <div className="conf-viewport">
        {/* STEP 1: MODEL */}
        <div className={`step-view ${step === 1 && !isCompleted ? 'active' : 'hidden'}`}>
          <div className="model-grid">
            {MODELS.map((model, idx) => {
              const isSelected = selectedModel?.id === model.id;
              return (
                <div 
                  key={model.id}
                  ref={cardRefs.current[idx]}
                  className={`model-card-3d ${isSelected ? 'selected' : ''}`}
                  onMouseMove={(e) => handleCardMove(e, model.id, cardRefs.current[idx], isSelected)}
                  onMouseLeave={() => handleCardLeave(model.id, cardRefs.current[idx], isSelected)}
                  onClick={() => {
                    SoundManager.play('gear-click', 0.08);
                    setSelectedModel(model);
                    // Reset inline styles for all cards on selection
                    MODELS.forEach((m, i) => {
                      const cardEl = cardRefs.current[i]?.current;
                      if (cardEl) {
                        cardEl.style.transform = '';
                        cardEl.style.transition = '';
                        const glare = cardEl.querySelector('.card-glare');
                        if (glare) {
                          glare.style.opacity = '0';
                          glare.style.background = '';
                        }
                      }
                    });
                  }}
                >
                  <div className="card-glare"></div>
                  <h3 className="font-serif">{model.name}</h3>
                  <div className="model-specs font-mono">
                    <div className="ss-col">
                      <span className="val"><CountUp target={model.hp} active={step === 1} /> hp</span>
                      <span className="lbl">POWER</span>
                    </div>
                    <div className="ss-col">
                      <span className="val"><CountUp target={model.accel} decimals={1} suffix="s" active={step === 1} /></span>
                      <span className="lbl">0-100 kph</span>
                    </div>
                  </div>
                  <div className="red-draw-line"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 2: COLOUR */}
        <div className={`step-view ${step === 2 && !isCompleted ? 'active' : 'hidden'}`}>
          <div className="color-stage">
            <div className="svg-wrapper cinematic-car-img" style={{ '--selected-color-alpha': 'transparent', '--bg-wash': selectedColor.hex + '33', boxShadow: 'none' }}>
              {selectedModel && step === 2 && <SF90Rotator model={selectedModel} color={selectedColor} />}
            </div>
            <div className="swatch-panel">
               <div className="active-swatch-details">
                 <h3 className="font-serif">{selectedColor.name}</h3>
                 <span className="font-mono">{selectedColor.hex}</span>
               </div>
               <div className="swatch-grid">
                 {COLORS.map(color => (
                   <button
                     key={color.id}
                     onClick={() => {
                        SoundManager.play('gear-click', 0.08);
                        setSelectedColor(color);
                     }}
                     className={`color-swatch-btn ${selectedColor.id === color.id ? 'active' : ''}`}
                     title={color.name}
                     style={{ background: color.hex }}
                   >
                     <div className="swatch-gloss"></div>
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* STEP 3: INTERIOR */}
        <div className={`step-view ${step === 3 && !isCompleted ? 'active' : 'hidden'}`}>
           <div className="interior-grid">
             {INTERIORS.map((int) => {
               const isSelected = selectedInterior?.id === int.id;
               return (
                 <div 
                   key={int.id}
                   className={`interior-quilt-card ${isSelected ? 'selected' : ''}`}
                   onClick={() => {
                     SoundManager.play('gear-click', 0.08);
                     setSelectedInterior(int);
                   }}
                 >
                   <div className="quilt-texture" style={{ '--int-color': int.hex }}></div>
                   <h3 className="font-serif">{int.name}</h3>
                   {isSelected && <div className="int-quote font-serif">"{int.quote}"</div>}
                   <div className="red-draw-line"></div>
                 </div>
               );
             })}
           </div>
        </div>

        {/* --- LUXURY COMPLETION SCREEN --- */}
        <div className={`step-view completion-view ${isCompleted ? 'active' : 'hidden'}`}>
           <div className="completion-content-enhanced">
              
              {!imgError ? (
                <div className="cinematic-car-img" style={{ 
                  '--selected-color-alpha': 'transparent', 
                  '--bg-wash': 'transparent',
                  boxShadow: 'none' 
                }}>
                   {selectedModel && isCompleted && <SF90Rotator model={selectedModel} color={selectedColor} />}
                </div>
              ) : renderPlaceholder()}

              <div className="config-oneliner font-mono">
                 {selectedModel?.name} &nbsp;·&nbsp; {selectedColor?.name} &nbsp;·&nbsp; {selectedInterior?.name} Interior
              </div>

              {!isDemoSubmitted ? (
                <div className="demo-drive">
                  <p className="demo-tagline font-mono">EXPERIENCE IT IN PERSON</p>
                  <h3 className="font-serif">YOUR {selectedModel?.name.toUpperCase()} AWAITS</h3>

                  <button 
                    type="button" 
                    className="demo-btn font-serif standalone-book-btn"
                    onClick={submitDemo}
                  >
                    BOOK YOUR DEMO RIDE NOW
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              ) : (
                <div className="success-state">
                  <div className="success-icon">✦</div>
                  <h3 className="font-serif">YOUR JOURNEY BEGINS</h3>
                  <p>A Ferrari specialist will contact you within 24 hours</p>
                  <p className="success-detail font-mono">
                    {selectedModel?.name} · {selectedColor?.name} · {selectedInterior?.name}
                  </p>
                  
                  <button className="reconfig-btn-loose magnetic outline-action" onClick={prevStep}>
                    BUILD ANOTHER
                  </button>
                </div>
              )}
           </div>
        </div>

      </div>

      {/* --- FOOTER CONTROLS --- */}
      {!isCompleted && (
        <div className="conf-footer">
          <MagneticButton className="nav-btn outline-action" disabled={step === 1} onClick={prevStep}>
            BACK
          </MagneticButton>
          <MagneticButton 
            className="nav-btn primary-action" 
            disabled={
              (step === 1 && !selectedModel) || 
              (step === 3 && !selectedInterior)
            }
            onClick={nextStep}
          >
            {step === 3 ? 'COMPLETE' : 'NEXT'}
          </MagneticButton>
        </div>
      )}
      {/* loose back button inside success view handled above manually */}
    </section>
  );
}

export default Configurator;
