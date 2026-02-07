import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey love 💗 I'm here to support you through whatever you're experiencing right now - whether it's nervous system regulation, mindset work, relationship patterns, manifestation, or reconnecting with your feminine energy. What's on your heart?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check authentication
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authenticated = sessionStorage.getItem('beta-authenticated');
      if (!authenticated) {
        router.push('/beta');
      }
    }
  }, [router]);

  // Load chat history
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

  // Save chat history
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 1) {
      localStorage.setItem('feminine-regulation-chat', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const currentMessages = [...messages, userMessage];
    
    console.log('USER MESSAGE:', userMessage);
    console.log('CURRENT MESSAGES:', currentMessages);
    
    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: currentMessages })
      });

      const data = await response.js
