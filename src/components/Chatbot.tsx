'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

export default function Chatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        id: 'init-1',
        sender: 'bot',
        text: 'Hi there! 👋 I am the Mahi Tech AI assistant. How can I help you today? You can ask about our services, founder, or how to get in touch!',
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    // Scroll to bottom
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response based on keyword matching
    setTimeout(() => {
      let replyText = "I'm not sure I understand that. You can ask about 'services', 'founder', 'contact info', or 'pricing'!";
      const query = input.toLowerCase();

      if (query.includes('service') || query.includes('work') || query.includes('develop') || query.includes('design')) {
        replyText = "We offer premium Web Development (React & Next.js), Mobile Apps (Flutter & React Native), UI/UX design, AI integrations, ERP databases, and cloud hosting solutions. Check our Services page for details!";
      } else if (query.includes('founder') || query.includes('ceo') || query.includes('vikash') || query.includes('maheshwari')) {
        replyText = "Mahi Technocrafts was founded by Vikash Maheshwari. He is dedicated to crafting premium, high-performance web ecosystems. Feel free to connect with him through our Founder section!";
      } else if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('call') || query.includes('address')) {
        replyText = "You can email us at support@mahitechnocrafts.in, call +91 6267144122, or visit our office at Hamidia Rd, Bhopal. You can also fill out the form in the Contact section to submit an inquiry directly!";
      } else if (query.includes('price') || query.includes('cost') || query.includes('budget') || query.includes('quote')) {
        replyText = "Project costs depend on the details and timeline. We offer a free initial consultation and outline a complete estimate. Please drop a message via our Contact form and our sales team will reach out within 24 hours!";
      } else if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
        replyText = "Hello! Hope you are having a great day. Let me know what you would like to learn about Mahi Technocrafts!";
      }

      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: replyText,
          timestamp: new Date()
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const selectQuickReply = (topic: string, text: string) => {
    setInput(text);
    // Submit query automatically after setting state (needs to handle directly in event flow)
    const userMessage: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "";
      if (topic === 'services') {
        replyText = "Our services include custom Web Development (Next.js/React), Mobile App Development, UI/UX designing, AI/LLM solutions, CRM systems, and DevOps/Cloud services.";
      } else if (topic === 'contact') {
        replyText = "Email us at support@mahitechnocrafts.in or call 6267144122. You can also submit the Contact Form at the bottom of the home page!";
      } else if (topic === 'founder') {
        replyText = "Our Founder & CEO is Vikash Maheshwari, who leads a team of 25+ developers and designers to build premium corporate platforms.";
      }

      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: replyText,
          timestamp: new Date()
        }
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Chat Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-sky-600 dark:bg-brand-blue hover:bg-sky-700 dark:hover:bg-brand-blue/90 text-white rounded-full flex items-center justify-center shadow-lg shadow-brand-blue/30 cursor-pointer transition-colors"
        aria-label="Toggle Mahi AI Assistant Chatbot"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="absolute bottom-16 right-0 w-80 md:w-96 h-[480px] rounded-2xl glass shadow-2xl flex flex-col overflow-hidden z-50 text-slate-800 dark:text-slate-100"
          >
            {/* Header */}
            <div className="p-4 bg-brand-blue text-white flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Mahi AI Assistant</h3>
                <span className="text-[10px] text-white/70">Online & Ready</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white ${msg.sender === 'user' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                      {msg.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                    </div>
                    <div>
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-brand-blue text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'}`}>
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-gray-500 mt-1 block px-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[80%] items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      <Bot size={12} />
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 rounded-tl-none flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick suggestions */}
            <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 flex gap-2 flex-wrap">
              <button onClick={() => selectQuickReply('services', 'What services do you offer?')} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-brand-blue/10 dark:hover:bg-brand-blue/20 text-[10px] rounded-full border border-slate-200 dark:border-slate-700 cursor-pointer">
                💼 Services
              </button>
              <button onClick={() => selectQuickReply('contact', 'How do I contact you?')} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-brand-blue/10 dark:hover:bg-brand-blue/20 text-[10px] rounded-full border border-slate-200 dark:border-slate-700 cursor-pointer">
                ✉️ Contact
              </button>
              <button onClick={() => selectQuickReply('founder', 'Who is the founder?')} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-brand-blue/10 dark:hover:bg-brand-blue/20 text-[10px] rounded-full border border-slate-200 dark:border-slate-700 cursor-pointer">
                👤 Founder
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2 items-center bg-white/50 dark:bg-slate-900/50">
              <input
                type="text"
                placeholder="Ask something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-blue text-slate-800 dark:text-slate-200"
              />
              <button type="submit" aria-label="Send message" className="w-8 h-8 rounded-xl bg-sky-600 dark:bg-brand-blue text-white flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-sky-700 dark:hover:bg-brand-blue/90">
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
