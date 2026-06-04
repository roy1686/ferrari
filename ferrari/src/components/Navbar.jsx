import { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import logo from '../assets/logo.png';
import { SoundManager } from '../utils/SoundManager';

// ----------------------------------------------------
// Search Index (Database of page sections)
// ----------------------------------------------------
const searchIndex = [
  {
    title: "The Genesis (1947) - 125 S Engine Start",
    keywords: ["125s", "genesis", "1947", "timeline", "history", "first", "start", "engine"],
    sectionId: "about",
    description: "Read about the first Ferrari, the Colombo V12-powered 125 S, starting its engine in 1947."
  },
  {
    title: "Alberto Ascari - First F1 Win (1952)",
    keywords: ["ascari", "win", "f1", "1952", "timeline", "heritage", "history"],
    sectionId: "about",
    description: "Learn about Alberto Ascari securing Ferrari's first F1 World Championship."
  },
  {
    title: "The Enzo Era (2002) - F1 Aerodynamics Hypercar",
    keywords: ["enzo", "hypercar", "era", "2002", "founder", "timeline", "heritage"],
    sectionId: "about",
    description: "Explore the Enzo Ferrari Hypercar Tribute on the heritage timeline."
  },
  {
    title: "LaFerrari (2013) - The First Hybrid Hypercar",
    keywords: ["laferrari", "hybrid", "2013", "timeline", "heritage", "history"],
    sectionId: "about",
    description: "Read about Ferrari's first hybrid hypercar delivering 963 cv of absolute power."
  },
  {
    title: "Charles Leclerc - Scuderia News",
    keywords: ["charles", "leclerc", "podium", "scuderia", "japan", "news", "f1"],
    sectionId: "collections", // Scrolls to RedSection (News)
    description: "Read the news coverage of Charles Leclerc securing another podium finish for Scuderia Ferrari HP in Japan."
  },
  {
    title: "Ferrari Custom Configurator",
    keywords: ["configurator", "configure", "customize", "paint", "wheels", "interior", "build", "calipers", "seats"],
    sectionId: "configurator",
    description: "Enter the custom configurator to spec your Ferrari with bespoke paints, brake calipers, and interior trims."
  },
  {
    title: "Scuderia Ferrari War Room & Live Telemetry",
    keywords: ["racing", "telemetry", "war room", "strategy", "lap", "stats", "f1", "track", "live"],
    sectionId: "racing",
    description: "Step into the pit wall and view real-time racing stats, circuit conditions, and driver telemetry data."
  },
  {
    title: "Ferrari Collections & New Arrivals",
    keywords: ["collections", "new arrivals", "apparel", "fashion", "clothing", "discover"],
    sectionId: "sports-cars", // Scrolls to Showcase (First item is Collections)
    description: "Explore the latest premium apparel collection and new arrivals inspired by motorsport design."
  },
  {
    title: "Ferrari Museums & Greatest Hits Exhibition",
    keywords: ["museums", "greatest hits", "maranello", "modena", "exhibition", "cars"],
    sectionId: "sports-cars", // Scrolls to Showcase (Second item is Greatest Hits)
    description: "Discover legendary models and exhibitions showcasing the racing DNA of Ferrari."
  }
];

// ----------------------------------------------------
// Chatbot Predefined Responses and Matching Logic
// ----------------------------------------------------
const botResponses = {
  welcome: "Welcome to Scuderia AI. I am Enzo, your virtual pit-wall assistant. How can I help you explore the Ferrari universe today?",
  default: "I am currently analyzing telemetry on that query. Try asking about 'Enzo Era', 'Charles Leclerc', '125 S', 'Configurator', 'F1 Racing', or 'Maranello'. Alternatively, click one of the suggested prompts below!",
  
  "first ferrari": "The first Ferrari was the Colombo V12-powered 125 S, built in 1947. Gioachino Colombo designed its 1.5L V12 engine, pushing out 118 horsepower. Read about it under the '1947' section of our Heritage Timeline!",
  "125 s": "The 125 S debuted in May 1947, marking the official birth of Ferrari. Its first race victory came at the Rome Grand Prix in the same month. You can view its details under the 'ABOUT US' timeline on this page.",
  
  "enzo era": "The Enzo Ferrari hypercar was launched in 2002 to honor our founder. It featured a 6.0L V12 engine pushing 660 CV, built using Formula 1 carbon fiber technology and active aerodynamics. Explore the 2002 Era in our Heritage Timeline!",
  "enzo": "Enzo Ferrari founded the Scuderia in 1929 and built the first Ferrari car in 1947. He famously said, 'If you can dream it, you can do it' and 'Aerodynamics are for people who can't build engines.'",
  
  "charles leclerc": "Charles Leclerc is Scuderia Ferrari HP's leading Formula 1 driver. Racing under number 16, he has secured multiple grand prix wins and podiums. Read about his latest podium in Japan in our News section!",
  "charles": "Charles Leclerc, born in Monaco, joined the Scuderia in 2019. He has captured fans globally with his speed and pole positions. Check out the Scuderia News section for Leclerc's recent podiums.",
  
  "configure": "You can design your own Ferrari in the Configurator section! Customize the paint (Rosso Corsa, Giallo Modena, Nero Daytona), select carbon wheels, custom calipers, and carbon-shelled racing seats.",
  "configurator": "Our Custom Configurator lets you spec a virtual Ferrari. Scroll down to the Configurator block or click 'EXPERIENCES' to start choosing your livery, wheels, and interior layout.",
  
  "racing": "Ferrari is the only team to have competed in every F1 season since the championship began in 1950. We hold the record for the most Constructors' Championships (16) and Drivers' Championships (15). Check out our real-time War Room telemetry section for live track stats!",
  "f1": "Scuderia Ferrari is the most successful team in Formula 1 history. Visit the War Room section on this page to view live telemetry, circuit layouts, and driver statistics.",
  
  "sound": "Experience the V8 growl and the V12 roar in our project! If you toggle audio on (bottom right icon), you will hear the engines rev up as you scroll and interact.",
  "v12": "The V12 is the heart and soul of Ferrari. From the Colombo V12 of 1947 to the hypercar engines of the Enzo and LaFerrari, its sound is unmatched. Make sure your sound is unmuted to hear its roar!"
};

const getBotResponse = (query) => {
  const q = query.toLowerCase().trim();
  if (q.includes("first") || q.includes("125")) return botResponses["first ferrari"];
  if (q.includes("enzo")) return botResponses["enzo era"];
  if (q.includes("charles") || q.includes("leclerc")) return botResponses["charles leclerc"];
  if (q.includes("configure") || q.includes("configurator") || q.includes("spec") || q.includes("paint") || q.includes("customize")) return botResponses["configure"];
  if (q.includes("racing") || q.includes("f1") || q.includes("telemetry") || q.includes("war room") || q.includes("track")) return botResponses["racing"];
  if (q.includes("sound") || q.includes("engine") || q.includes("v12") || q.includes("v8") || q.includes("roar")) return botResponses["v12"];
  return botResponses.default;
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const clickCount = useRef(0);

  // Search States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);

  // Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'assistant', text: botResponses.welcome }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const handleLogoClick = () => {
    clickCount.current += 1;
    if (clickCount.current === 3) {
      SoundManager.play('v12-roar', 0.20);
      clickCount.current = 0;
    }
  };

  const handleNavHover = () => {
    SoundManager.play('gear-click', 0.08);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard controls for closing panels
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsChatOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll chat drawer to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  // ----------------------------------------------------
  // Interaction Handlers
  // ----------------------------------------------------
  const toggleSearch = () => {
    SoundManager.play('paddle-shift', 0.12);
    setIsSearchOpen(!isSearchOpen);
    setIsChatOpen(false);
  };

  const toggleChat = () => {
    SoundManager.play('paddle-shift', 0.12);
    setIsChatOpen(!isChatOpen);
    setIsSearchOpen(false);
  };

  const handleSearchInput = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }
    const filtered = searchIndex.filter(item => 
      item.title.toLowerCase().includes(val.toLowerCase()) || 
      item.description.toLowerCase().includes(val.toLowerCase()) ||
      item.keywords.some(keyword => keyword.toLowerCase().includes(val.toLowerCase()))
    );
    setSearchResults(filtered);
  };

  const handleResultClick = (sectionId) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    SoundManager.play('gear-click', 0.10);
    
    const element = document.getElementById(sectionId);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
  };

  const handleSendMessage = (textToSend = '') => {
    const text = textToSend || userInput;
    if (!text.trim()) return;

    SoundManager.play('gear-click', 0.10);

    const newMessages = [...chatMessages, { sender: 'user', text }];
    setChatMessages(newMessages);
    if (!textToSend) setUserInput('');

    setIsTyping(true);

    setTimeout(() => {
      const reply = getBotResponse(text);
      setChatMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
      setIsTyping(false);
      SoundManager.play('paddle-shift', 0.08);
    }, 1200);
  };

  const fillSearchTerm = (term) => {
    SoundManager.play('gear-click', 0.06);
    setSearchQuery(term);
    const filtered = searchIndex.filter(item => 
      item.title.toLowerCase().includes(term.toLowerCase()) || 
      item.keywords.some(keyword => keyword.toLowerCase().includes(term.toLowerCase()))
    );
    setSearchResults(filtered);
    searchInputRef.current?.focus();
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : 'transparent'}`}>
        <div className="nav-container">
          <div className="nav-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <img src={logo} alt="Ferrari Logo" className="logo-img" />
          </div>
          
          <div className="nav-links">
            <button className="nav-btn" onMouseEnter={handleNavHover} onClick={() => document.getElementById('racing')?.scrollIntoView({behavior: 'smooth'})}>RACING</button>
            <button className="nav-btn" onMouseEnter={handleNavHover} onClick={() => document.getElementById('sports-cars')?.scrollIntoView({behavior: 'smooth'})}>SPORTS CARS</button>
            <button className="nav-btn" onMouseEnter={handleNavHover} onClick={() => document.getElementById('collections')?.scrollIntoView({behavior: 'smooth'})}>COLLECTIONS</button>
            <button className="nav-btn" onMouseEnter={handleNavHover} onClick={() => document.getElementById('configurator')?.scrollIntoView({behavior: 'smooth'})}>EXPERIENCES</button>
            <button className="nav-btn" onMouseEnter={handleNavHover} onClick={() => document.getElementById('about')?.scrollIntoView({behavior: 'smooth'})}>ABOUT US</button>
          </div>

          <div className="nav-right">
            <button className="nav-icon-btn search-trigger" onClick={toggleSearch} aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <button className="ask-me-btn" onClick={toggleChat}>
              <span className="ask-me-glow"></span>
              <span className="ask-me-text">ASK ME</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="chat-bubble-icon">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ---------------------------------------------------- */}
      {/* Search Overlay */}
      {/* ---------------------------------------------------- */}
      {isSearchOpen && (
        <div className="search-overlay">
          <div className="search-overlay-blur" onClick={toggleSearch}></div>
          <div className="search-modal">
            <button className="search-close-btn" onClick={toggleSearch}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="search-header">
              <span className="search-tagline font-mono">SCUDERIA DATABASE SEARCH</span>
              <h2 className="font-serif">EXPLORE FERRARI</h2>
            </div>

            <div className="search-input-wrapper">
              <input 
                type="text" 
                ref={searchInputRef}
                value={searchQuery}
                onChange={handleSearchInput}
                placeholder="Search telemetry, timeline, cars, racing, news..." 
                className="search-field font-sans"
              />
              <span className="search-input-line"></span>
            </div>

            {searchQuery === '' ? (
              <div className="search-suggestions">
                <span className="suggestions-title font-mono">TRENDING SEARCHES:</span>
                <div className="suggestions-grid">
                  <button onClick={() => fillSearchTerm('Charles Leclerc')} className="suggest-btn">Charles Leclerc</button>
                  <button onClick={() => fillSearchTerm('Enzo Era')} className="suggest-btn">Enzo Era</button>
                  <button onClick={() => fillSearchTerm('Configurator')} className="suggest-btn">Configurator</button>
                  <button onClick={() => fillSearchTerm('125 S')} className="suggest-btn">125 S</button>
                  <button onClick={() => fillSearchTerm('War Room')} className="suggest-btn">Telemetry</button>
                </div>
              </div>
            ) : (
              <div className="search-results-area">
                <span className="results-count font-mono">{searchResults.length} RESULTS FOUND</span>
                <div className="search-results-list scroll-styled">
                  {searchResults.length > 0 ? (
                    searchResults.map((result, idx) => (
                      <div 
                        key={idx} 
                        className="search-result-card" 
                        onClick={() => handleResultClick(result.sectionId)}
                      >
                        <div className="result-glow"></div>
                        <h4 className="result-title font-serif">{result.title}</h4>
                        <p className="result-desc font-sans">{result.description}</p>
                        <span className="result-action font-mono">GO TO SECTION &rarr;</span>
                      </div>
                    ))
                  ) : (
                    <div className="no-results-state font-mono">
                      NO ENTRIES MATCH YOUR CRITERIA
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Ask Me Chat Drawer */}
      {/* ---------------------------------------------------- */}
      <div className={`chat-drawer ${isChatOpen ? 'open' : ''}`}>
        <div className="chat-drawer-header">
          <div className="header-status">
            <span className="status-indicator-dot pulsing"></span>
            <div className="status-text">
              <h4 className="font-serif">SCUDERIA AI</h4>
              <span className="font-mono">PIT WALL TELEMETRY ONLINE</span>
            </div>
          </div>
          <button className="chat-close-btn" onClick={toggleChat}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="chat-messages-area scroll-styled">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`chat-msg-wrapper ${msg.sender}`}>
              {msg.sender === 'assistant' && (
                <div className="ai-avatar font-mono">SF</div>
              )}
              <div className="chat-msg-bubble">
                <p className="font-sans">{msg.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-msg-wrapper assistant">
              <div className="ai-avatar font-mono">SF</div>
              <div className="chat-msg-bubble typing-bubble">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-drawer-footer">
          <div className="chat-chips-scroll scroll-styled">
            <button onClick={() => handleSendMessage('Who is Charles Leclerc?')} className="chat-chip">Charles Leclerc?</button>
            <button onClick={() => handleSendMessage('Tell me about the Enzo Era')} className="chat-chip">Enzo Era?</button>
            <button onClick={() => handleSendMessage('How to configure a Ferrari')} className="chat-chip">Configurator?</button>
            <button onClick={() => handleSendMessage('What is the V12 Symphony?')} className="chat-chip">V12 Sound?</button>
          </div>

          <form 
            className="chat-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input 
              type="text" 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask Enzo a question..." 
              className="chat-input-field font-sans"
            />
            <button type="submit" className="chat-send-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Navbar;
