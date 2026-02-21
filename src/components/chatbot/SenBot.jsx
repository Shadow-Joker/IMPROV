import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Mic, X, Send, Command, Volume2 } from 'lucide-react';
import { classifyIntent } from '../../utils/chatIntents';

export default function SenBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Vanakkam! I am SenBot. How can I assist you tonight?' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Classify intent
    const intent = classifyIntent(text);
    
    setTimeout(() => {
      const botMsg = { role: 'bot', text: intent.response };
      setMessages(prev => [...prev, botMsg]);

      // Execute action
      if (intent.action === 'navigate') {
        setTimeout(() => {
          navigate(intent.target);
          setIsOpen(false);
        }, 1000);
      }

      // Voice output
      if (window.speechSynthesis) {
        const lang = localStorage.getItem('sentrak_language') === 'ta' ? 'ta-IN' : 'en-IN';
        const utterance = new SpeechSynthesisUtterance(intent.response);
        utterance.lang = lang;
        window.speechSynthesis.speak(utterance);
      }
    }, 500);
  };

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = localStorage.getItem('sentrak_language') === 'ta' ? 'ta-IN' : 'en-IN';
    recognition.continuous = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="btn-primary"
        style={{
          position: 'fixed', bottom: '85px', right: '20px',
          width: '56px', height: '56px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(0,212,170,0.3)', zIndex: 99
        }}
      >
        <Bot size={28} />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '0', left: '0', right: '0', top: '0',
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          zIndex: 1000, display: 'flex', flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            padding: '1.5rem', borderBottom: '1px solid var(--border-primary)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'var(--bg-secondary)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Bot style={{ color: 'var(--accent-primary)' }} />
              <div>
                <h3 style={{ margin: 0 }}>SenBot</h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--status-success)' }}>● AI Assistant Online</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff' }}>
              <X size={24} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '0.8rem 1.2rem',
                borderRadius: m.role === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0',
                background: m.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: '#fff',
                fontSize: '0.95rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                {m.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-primary)' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button 
                onClick={toggleListening}
                className={isListening ? 'pulse' : ''}
                style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: isListening ? 'var(--status-error)' : 'var(--bg-tertiary)',
                  border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <Mic size={20} />
              </button>
              
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Ask anything..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend(input)}
                  style={{
                    width: '100%', padding: '0.8rem 1rem', borderRadius: '24px',
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)',
                    color: '#fff', outline: 'none'
                  }}
                />
                <button 
                  onClick={() => handleSend(input)}
                  style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--accent-primary)'
                  }}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginTop: '1rem', paddingBottom: '0.5rem' }}>
              {['Match Schemes', 'Register Athlete', 'Show Profile', 'Help'].map(tip => (
                <button 
                  key={tip}
                  onClick={() => handleSend(tip)}
                  style={{
                    whiteSpace: 'nowrap', padding: '0.4rem 1rem', borderRadius: '20px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-primary)',
                    color: 'var(--text-secondary)', fontSize: '0.8rem'
                  }}
                >
                  {tip}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
