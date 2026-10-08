'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquare, X, SendHorizontal, Bot, User, Phone, Sparkles, RefreshCw, ShieldCheck } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user' | 'system';
  text: string;
  timestamp: string;
}

const STORAGE_SESSION_KEY = 'mahi_chat_session_id';

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export default function Chatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [leadSubmitted, setLeadSubmitted] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Lead form inputs for the initial capture card
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formError, setFormError] = useState('');

  // Hide on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // 1. Initialize sessionId from localStorage (Frontend only stores sessionId)
  useEffect(() => {
    let sid = '';
    try {
      sid = localStorage.getItem(STORAGE_SESSION_KEY) || '';
      if (!sid) {
        sid = generateSessionId();
        localStorage.setItem(STORAGE_SESSION_KEY, sid);
      }
    } catch {
      sid = generateSessionId();
    }
    setSessionId(sid);
  }, []);

  // 2. Fetch session details and messages from backend on load/refresh
  useEffect(() => {
    if (!sessionId) return;

    let isMounted = true;
    const loadSession = async () => {
      try {
        setIsLoadingSession(true);
        const res = await fetch(`/api/chat?sessionId=${sessionId}`);
        if (!res.ok) return;

        const data = await res.json();
        if (!isMounted) return;

        if (data.success && data.session) {
          const session = data.session;
          if (session.clientName) setClientName(session.clientName);
          if (session.clientPhone) {
            setClientPhone(session.clientPhone);
            setLeadSubmitted(true);
          }
          if (Array.isArray(session.messages) && session.messages.length > 0) {
            setMessages(session.messages);
          } else {
            // First time greeting
            setMessages([
              {
                id: 'init-1',
                sender: 'bot',
                text: 'Namaste! 👋 I am Mahi Technocrafts AI BOT, the official assistant of Mahi TechnoCrafts. How can I help you today with your website, mobile app, or software requirements?',
                timestamp: new Date().toISOString()
              }
            ]);
          }
        } else {
          // New session with initial greeting
          setMessages([
            {
              id: 'init-1',
              sender: 'bot',
              text: 'Namaste! 👋 I am Mahi Technocrafts AI BOT, the official assistant of Mahi TechnoCrafts. How can I help you today with your website, mobile app, or software requirements?',
              timestamp: new Date().toISOString()
            }
          ]);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      } finally {
        if (isMounted) setIsLoadingSession(false);
      }
    };

    loadSession();
    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  // Submit Lead Information (Name & Phone)
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPhone.trim() || formPhone.trim().length < 8) {
      setFormError('Please enter a valid WhatsApp / Phone number');
      return;
    }

    setFormError('');
    const cleanName = formName.trim() || 'Client';
    const cleanPhone = formPhone.trim();

    setClientName(cleanName);
    setClientPhone(cleanPhone);
    setLeadSubmitted(true);

    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          clientName: cleanName,
          clientPhone: cleanPhone,
          message: `Hi, I am ${cleanName}. My WhatsApp number is ${cleanPhone}.`,
        }),
      });

      // Update local state with the user intro and bot's warm welcome
      const newMessages: ChatMessage[] = [
        ...messages,
        {
          id: `u-${Date.now()}`,
          sender: 'user',
          text: `My name is ${cleanName} and my contact is ${cleanPhone}.`,
          timestamp: new Date().toISOString(),
        },
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: `Welcome ${cleanName}! Great to connect with you. I'm here to answer any questions about Mahi TechnoCrafts' custom websites, mobile apps, software solutions, and transparent pricing starting from ₹2,999*. What can I build for you?`,
          timestamp: new Date().toISOString(),
        }
      ];
      setMessages(newMessages);
    } catch (err) {
      console.error('Failed to submit lead details:', err);
    }
  };

  // Send a chat message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isTyping) return;

    setInput('');
    const tempUserMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: text,
          clientName,
          clientPhone,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.reply) {
          const tempBotMsg: ChatMessage = {
            id: `b_${Date.now()}`,
            sender: 'bot',
            text: data.reply,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, tempBotMsg]);
        }
      } else {
        throw new Error('Failed to fetch AI reply');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'bot',
          text: "I'm having a brief connection delay. Please feel free to reach our team directly on WhatsApp at +91 6267144122 or email support@mahitechnocrafts.in for instant assistance!",
          timestamp: new Date().toISOString(),
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  // Reset / Clear chat session
  const handleResetChat = () => {
    if (confirm('Start a new chat conversation?')) {
      const newSid = generateSessionId();
      try {
        localStorage.setItem(STORAGE_SESSION_KEY, newSid);
      } catch {}
      setSessionId(newSid);
      setClientName('');
      setClientPhone('');
      setLeadSubmitted(false);
      setMessages([
        {
          id: 'init-fresh',
          sender: 'bot',
          text: 'Namaste! 👋 I am Mahi Technocrafts AI BOT. How can I assist you with your business software or web project today?',
          timestamp: new Date().toISOString(),
        }
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-sky-600 via-sky-500 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-sky-500/30 cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 group relative"
        aria-label="Toggle Mahi Technocrafts AI BOT"
      >
        {isOpen ? (
          <X size={24} className="transition-transform group-hover:rotate-90 duration-200" />
        ) : (
          <>
            <MessageSquare size={24} />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 w-[90vw] sm:w-[410px] h-[540px] max-h-[82vh] rounded-3xl bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden z-50 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <Bot size={22} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-tight">Mahi Technocrafts AI BOT</h3>
                  <Sparkles size={13} className="text-amber-300" />
                </div>
                <div className="flex items-center gap-1 text-[11px] text-sky-100/90 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span>Official AI Assistant • Bhopal, MP</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Start new conversation"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 rounded-lg transition"
                aria-label="Reset chat"
              >
                <RefreshCw size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 rounded-lg transition"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Subheader info strip */}
          <div className="bg-sky-50/70 dark:bg-slate-800/60 border-b border-sky-100 dark:border-slate-800 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-sky-600 dark:text-sky-400" />
              Starting from ₹2,999* • 6 Mo. Free Support
            </span>
            <a
              href="https://wa.me/916267144122"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Phone size={11} />
              +91 6267144122
            </a>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {isLoadingSession && (
              <div className="text-center py-4 text-slate-400 text-[11px] animate-pulse">
                Restoring your conversation from secure cloud...
              </div>
            )}

            {/* Initial Lead Collection Card (if phone not submitted yet) */}
            {!leadSubmitted && (
              <div className="bg-gradient-to-br from-sky-50 to-indigo-50/60 dark:from-slate-800/80 dark:to-slate-800/40 border border-sky-200 dark:border-slate-700/80 rounded-2xl p-3.5 shadow-sm space-y-2.5">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center flex-shrink-0 text-[11px] font-bold">
                    👋
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-[12px]">
                      Quick Introduction
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      Please enter your name & WhatsApp number so our engineering team can assist you seamlessly.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-2 pt-1">
                  <input
                    type="text"
                    placeholder="Your Name (e.g., Rajesh Sharma)"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500 text-slate-800 dark:text-slate-100"
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp / Phone (e.g., 9876543210)"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500 text-slate-800 dark:text-slate-100"
                  />
                  {formError && (
                    <p className="text-red-500 text-[10px] font-medium">{formError}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-sky-500/20 transition cursor-pointer"
                  >
                    Start Chatting with Mahi AI
                  </button>
                </form>
              </div>
            )}

            {/* Chat History */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex gap-2 max-w-[85%] ${
                    msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-tr from-indigo-600 to-purple-600'
                        : 'bg-gradient-to-tr from-sky-600 to-blue-600'
                    }`}
                  >
                    {msg.sender === 'user' ? <User size={13} /> : <Bot size={13} />}
                  </div>
                  <div>
                    <div
                      className={`p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-tr-none shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 block px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[80%] items-center">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-sky-600 to-blue-600 flex items-center justify-center text-white">
                    <Bot size={13} />
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60 flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick suggestions pills */}
          <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar bg-slate-50/70 dark:bg-slate-900/70">
            <button
              onClick={() => handleSendMessage('What services does Mahi TechnoCrafts offer?')}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-[11px] rounded-full border border-slate-200 dark:border-slate-700 whitespace-nowrap cursor-pointer transition text-slate-700 dark:text-slate-300 font-medium"
            >
              💼 Services
            </button>
            <button
              onClick={() => handleSendMessage('What is your website & app development pricing?')}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-[11px] rounded-full border border-slate-200 dark:border-slate-700 whitespace-nowrap cursor-pointer transition text-slate-700 dark:text-slate-300 font-medium"
            >
              💰 Pricing (from ₹2,999*)
            </button>
            <button
              onClick={() => handleSendMessage('Who is the founder and CEO of Mahi TechnoCrafts?')}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-[11px] rounded-full border border-slate-200 dark:border-slate-700 whitespace-nowrap cursor-pointer transition text-slate-700 dark:text-slate-300 font-medium"
            >
              👤 Founder & CEO
            </button>
            <button
              onClick={() => handleSendMessage('Where is your Bhopal office and how can I contact you?')}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-[11px] rounded-full border border-slate-200 dark:border-slate-700 whitespace-nowrap cursor-pointer transition text-slate-700 dark:text-slate-300 font-medium"
            >
              📍 Bhopal Office
            </button>
          </div>

          {/* User Input Bar */}
          <form
            onSubmit={handleFormSubmit}
            className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2 items-center bg-white dark:bg-slate-900"
          >
            <input
              type="text"
              placeholder={clientName ? `Ask about Mahi TechnoCrafts, ${clientName}...` : "Ask about our services, pricing, projects..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-sky-500 text-slate-800 dark:text-slate-100 transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
              className="w-9 h-9 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 cursor-pointer hover:from-sky-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-sky-500/20"
            >
              <SendHorizontal size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
