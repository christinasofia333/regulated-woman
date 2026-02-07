import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Hey love 💗 I'm here to support you. What's on your heart?"
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authenticated = sessionStorage.getItem('beta-authenticated');
      if (!authenticated) {
        router.push('/beta');
      }
    }
  }, [router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('feminine-regulation-chat');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        } catch (e) {
          console.error('Error loading chat:', e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 1) {
      localStorage.setItem('feminine-regulation-chat', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const allMessages = [...messages, userMessage];
    
    setMessages(allMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now, love. 💗"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm('Clear your chat history?')) {
      setMessages([{
        role: 'assistant',
        content: "Hey love 💗 I'm here to support you. What's on your heart?"
      }]);
      localStorage.removeItem('feminine-regulation-chat');
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100vh', background: 'linear-gradient(to bottom right, #fce7f3, #fae8ff)'}}>
      <div style={{background: 'white', borderBottom: '1px solid #fda4af', padding: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
        <div style={{maxWidth: '48rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <div style={{width: '3rem', height: '3rem', background: 'linear-gradient(to bottom right, #fb7185, #c084fc)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'}}>💗</div>
            <div>
              <h1 style={{fontSize: '1.25rem', fontWeight: '600', color: '#1f2937'}}>Feminine Regulation v2.0</h1>
              <p style={{fontSize: '0.875rem', color: '#6b7280'}}>Mind • Body • Heart • Soul</p>
            </div>
          </div>
          <button onClick={clearChat} style={{fontSize: '0.875rem', color: '#6b7280', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', border: 'none', background: 'transparent', cursor: 'pointer'}}>Clear Chat</button>
        </div>
      </div>

      <div style={{flex: 1, overflowY: 'auto', padding: '1rem'}}>
        <div style={{maxWidth: '48rem', margin: '0 auto'}}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '1rem'}}>
              <div style={{
                maxWidth: '32rem',
                borderRadius: '1rem',
                padding: '0.75rem 1rem',
                background: msg.role === 'user' ? 'linear-gradient(to right, #fb7185, #f9a8d4)' : 'white',
                color: msg.role === 'user' ? 'white' : '#1f2937',
                boxShadow: msg.role === 'user' ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                border: msg.role === 'user' ? 'none' : '1px solid #fecdd3'
              }}>
                <p style={{whiteSpace: 'pre-wrap', margin: 0}}>{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem'}}>
              <div style={{background: 'white', borderRadius: '1rem', padding: '0.75rem 1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #fecdd3'}}>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <div style={{width: '0.5rem', height: '0.5rem', background: '#fb7185', borderRadius: '50%', animation: 'bounce 1s infinite'}}></div>
                  <div style={{width: '0.5rem', height: '0.5rem', background: '#fb7185', borderRadius: '50%', animation: 'bounce 1s infinite 0.15s'}}></div>
                  <div style={{width: '0.5rem', height: '0.5rem', background: '#fb7185', borderRadius: '50%', animation: 'bounce 1s infinite 0.3s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{background: 'white', borderTop: '1px solid #fda4af', padding: '1rem', boxShadow: '0 -1px 2px rgba(0,0,0,0.05)'}}>
        <div style={{maxWidth: '48rem', margin: '0 auto', display: 'flex', gap: '0.5rem'}}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Share what's on your heart..."
            style={{flex: 1, padding: '0.75rem 1rem', borderRadius: '9999px', border: '1px solid #fda4af', outline: 'none', fontSize: '1rem'}}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            style={{
              background: 'linear-gradient(to right, #fb7185, #f9a8d4)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              border: 'none',
              cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
              opacity: isLoading || !input.trim() ? 0.5 : 1,
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            Send
          </button>
        </div>
      </div>

      <div style={{background: '#faf5ff', borderTop: '1px solid #e9d5ff', padding: '0.75rem', textAlign: 'center'}}>
        <p style={{fontSize: '0.75rem', color: '#9333ea', margin: 0}}>✨ Educational wellness tool • Not therapy • Crisis? Call 988</p>
        <p style={{fontSize: '0.75rem', color: '#a855f7', margin: '0.25rem 0 0 0'}}>Created by Christina Sofia • <a href="https://christinasofia.com" style={{textDecoration: 'underline'}}>christinasofia.com</a></p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-0.5rem); }
        }
      `}</style>
    </div>
  );
}
