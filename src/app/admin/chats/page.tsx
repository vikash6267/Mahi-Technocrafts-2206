'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Bot,
  Search,
  Phone,
  MessageCircle,
  Trash2,
  Loader2,
  Clock,
  RefreshCw,
  Calendar,
  Sparkles,
  User,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';
import { ChatSession, ChatMessage } from '@/lib/db';

export default function AdminChatsPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'leads' | 'today'>('all');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchChats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/chats?limit=150');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.sessions)) {
          setSessions(data.sessions);
          if (data.sessions.length > 0 && !selectedSessionId) {
            setSelectedSessionId(data.sessions[0].sessionId);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch chat logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const handleDelete = async (sessionId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this chat session?')) return;

    setDeletingId(sessionId);
    try {
      const res = await fetch(`/api/admin/chats?sessionId=${encodeURIComponent(sessionId)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
        if (selectedSessionId === sessionId) {
          const remaining = sessions.filter((s) => s.sessionId !== sessionId);
          setSelectedSessionId(remaining[0]?.sessionId || null);
        }
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // Top Metrics
  const metrics = useMemo(() => {
    const total = sessions.length;
    const leads = sessions.filter((s) => s.clientPhone && s.clientPhone.trim().length > 0).length;
    const totalMessages = sessions.reduce((acc, s) => acc + (s.messages?.length || 0), 0);

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const todayChats = sessions.filter((s) => {
      const d = s.updatedAt || s.createdAt;
      return d && d.slice(0, 10) === todayStr;
    }).length;

    return { total, leads, totalMessages, todayChats };
  }, [sessions]);

  // Filtering
  const filteredSessions = useMemo(() => {
    const now = new Date().toISOString().slice(0, 10);

    return sessions.filter((session) => {
      // Type Filter
      if (filterType === 'leads' && (!session.clientPhone || !session.clientPhone.trim())) {
        return false;
      }
      if (filterType === 'today') {
        const d = session.updatedAt || session.createdAt;
        if (!d || d.slice(0, 10) !== now) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = (session.clientName || '').toLowerCase();
        const phone = (session.clientPhone || '').toLowerCase();
        const sid = (session.sessionId || '').toLowerCase();
        const messagesText = (session.messages || []).map((m) => m.text).join(' ').toLowerCase();

        return name.includes(q) || phone.includes(q) || sid.includes(q) || messagesText.includes(q);
      }

      return true;
    });
  }, [sessions, filterType, searchQuery]);

  const activeSession = useMemo(() => {
    return sessions.find((s) => s.sessionId === selectedSessionId) || filteredSessions[0] || null;
  }, [sessions, selectedSessionId, filteredSessions]);

  const handleCopyTranscript = () => {
    if (!activeSession) return;
    const transcript = [
      `--- Mahi Technocrafts AI Bot Conversation ---`,
      `Session ID: ${activeSession.sessionId}`,
      `Client: ${activeSession.clientName || 'Anonymous Visitor'}`,
      `Phone: ${activeSession.clientPhone || 'Not provided'}`,
      `Date: ${new Date(activeSession.createdAt || '').toLocaleString('en-IN')}`,
      `Total Messages: ${activeSession.messages?.length || 0}`,
      `----------------------------------------------`,
      ...(activeSession.messages || []).map(
        (m) => `[${new Date(m.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}] ${m.sender === 'user' ? (activeSession.clientName || 'User') : 'AI Bot'}: ${m.text}`
      )
    ].join('\n\n');

    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AdminLayoutShell
      title="AI Chatbot Logs & Live Conversations"
      subtitle="Track what visitors ask the AI bot, inspect questions, and follow up directly on WhatsApp"
    >
      <div className="space-y-6">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Conversations</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{metrics.total}</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
              <Bot size={20} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Leads with Phone</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{metrics.leads}</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <MessageCircle size={20} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Total Messages</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{metrics.totalMessages}</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Sparkles size={20} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Active Today</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{metrics.todayChats}</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search chat text, client name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-sky-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: `All (${sessions.length})` },
              { id: 'leads', label: `With Phone (${metrics.leads})` },
              { id: 'today', label: `Today (${metrics.todayChats})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              onClick={fetchChats}
              disabled={isLoading}
              title="Refresh Chat Logs"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Main Content Split-View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
          {/* Left Column: Chat Sessions List */}
          <div className="lg:col-span-5 flex flex-col rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-[620px]">
            <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Visitor Sessions ({filteredSessions.length})
              </span>
              <span className="text-[11px] text-slate-400">Click to read transcript</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
              {isLoading && sessions.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Loader2 size={24} className="animate-spin mx-auto mb-2 text-sky-500" />
                  <p className="text-xs font-medium">Loading live chat logs...</p>
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Bot size={28} className="mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-medium">No chat sessions found matching your filter.</p>
                </div>
              ) : (
                filteredSessions.map((s) => {
                  const isSelected = activeSession?.sessionId === s.sessionId;
                  const hasPhone = Boolean(s.clientPhone && s.clientPhone.trim());
                  const lastMsg = s.messages && s.messages.length > 0 ? s.messages[s.messages.length - 1] : null;
                  const firstUserMsg = s.messages?.find((m) => m.sender === 'user');
                  const messageCount = s.messages?.length || 0;
                  const time = new Date(s.updatedAt || s.createdAt || '').toLocaleString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div
                      key={s.sessionId}
                      onClick={() => setSelectedSessionId(s.sessionId)}
                      className={`p-3.5 transition-colors cursor-pointer relative group ${
                        isSelected
                          ? 'bg-sky-50/80 dark:bg-sky-950/30 border-l-4 border-sky-600'
                          : 'hover:bg-slate-50/60 dark:hover:bg-slate-900/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                            hasPhone
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}>
                            {hasPhone ? <Phone size={13} /> : <User size={14} />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{s.clientName || 'Anonymous Visitor'}</span>
                              {hasPhone && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-300 dark:border-emerald-800">
                                  LEAD
                                </span>
                              )}
                            </p>
                            {hasPhone && (
                              <p className="text-[11px] font-mono text-emerald-600 font-bold">
                                {s.clientPhone}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">{time}</span>
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                            {messageCount} msgs
                          </span>
                        </div>
                      </div>

                      {/* Preview of what was asked */}
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-2">
                        <strong className="text-slate-700 dark:text-slate-300">User:</strong>{' '}
                        {firstUserMsg ? firstUserMsg.text : (lastMsg?.text || 'Started conversation')}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Full Conversation Transcript */}
          <div className="lg:col-span-7 flex flex-col rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-[620px]">
            {activeSession ? (
              <>
                {/* Transcript Header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md">
                      <Bot size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{activeSession.clientName || 'Visitor'}</span>
                        <span className="font-mono text-[10px] font-normal text-slate-400">
                          ({activeSession.sessionId.slice(0, 14)}...)
                        </span>
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(activeSession.createdAt || '').toLocaleString('en-IN')}
                        </span>
                        <span>•</span>
                        <span>{activeSession.messages?.length || 0} messages total</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2">
                    {activeSession.clientPhone && (
                      <a
                        href={`https://wa.me/${activeSession.clientPhone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <MessageCircle size={13} />
                        <span>WhatsApp Client</span>
                      </a>
                    )}

                    <button
                      onClick={handleCopyTranscript}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Copy entire conversation text"
                    >
                      {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => handleDelete(activeSession.sessionId)}
                      disabled={deletingId === activeSession.sessionId}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Delete this chat transcript"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Messages Bubbles Area */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30 dark:bg-[#02000d]/40">
                  {(!activeSession.messages || activeSession.messages.length === 0) ? (
                    <div className="p-8 text-center text-slate-400">
                      <p className="text-xs">No message turns recorded in this session.</p>
                    </div>
                  ) : (
                    activeSession.messages.map((msg, i) => {
                      const isUser = msg.sender === 'user';
                      const msgTime = new Date(msg.timestamp).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      });

                      return (
                        <div
                          key={i}
                          className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                          {/* Avatar */}
                          <div
                            className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold shadow-xs ${
                              isUser
                                ? 'bg-sky-600 text-white'
                                : 'bg-slate-800 text-sky-400 border border-sky-500/30'
                            }`}
                          >
                            {isUser ? <User size={13} /> : <Bot size={13} />}
                          </div>

                          {/* Message Body */}
                          <div className={`max-w-[78%] space-y-1 ${isUser ? 'text-right' : 'text-left'}`}>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
                              <span className="font-bold text-slate-600 dark:text-slate-300">
                                {isUser ? (activeSession.clientName || 'Visitor') : 'Mahi Technocrafts AI'}
                              </span>
                              <span>{msgTime}</span>
                            </div>

                            <div
                              className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                                isUser
                                  ? 'bg-sky-600 text-white rounded-tr-none shadow-sm'
                                  : 'bg-white dark:bg-[#0c1028] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800/80 rounded-tl-none shadow-sm'
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Transcript Footer Bar */}
                <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#070918] flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>Live MongoDB Atlas Sync • Instant Transcripts</span>
                  </div>
                  {activeSession.clientPhone && (
                    <a
                      href={`tel:${activeSession.clientPhone}`}
                      className="font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <Phone size={12} />
                      <span>Direct Call: {activeSession.clientPhone}</span>
                    </a>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <Bot size={40} className="text-slate-300 dark:text-slate-700 mb-3" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Chat Selected</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Select any visitor chat from the left panel to inspect the full question-and-answer transcript.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayoutShell>
  );
}
