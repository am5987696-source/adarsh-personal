import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareCode,
  Send,
  Sparkles,
  Copy,
  Check,
  Trash2,
  Building2,
  HardHat,
  HelpCircle,
  FileText,
  ShieldCheck,
  Clock,
  ListTodo,
} from 'lucide-react';
import { Project, ChatMessage } from '../types';
import { api } from '../services/api';

interface DailySiteAssistantModuleProps {
  projects: Project[];
  selectedProjectId: string;
}

export const DailySiteAssistantModule: React.FC<DailySiteAssistantModuleProps> = ({
  projects,
  selectedProjectId,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectId] = useState(selectedProjectId || projects[0]?.id || '');
  const [contextType, setContextType] = useState('Quality & Structural');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await api.getAssistantHistory();
        if (res.messages && res.messages.length) {
          setMessages(res.messages);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    }
    loadHistory();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      projectId: activeProjectId,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.sendAssistantMessage({
        message: text,
        projectId: activeProjectId,
        contextType,
      });

      if (res.success && res.reply) {
        setMessages((prev) => [...prev, res.reply]);
      }
    } catch (err) {
      console.error('Assistant request failed:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'model',
          content: 'I encountered an issue connecting to the AI inference service. Please retry your request.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([]);
  };

  const suggestedQuestions = [
    'What should I inspect before concrete pouring?',
    'Create a daily site inspection checklist',
    'What factors affect concrete curing?',
    'Create a daily progress report template',
    'What safety precautions are required for work at height?',
    'What are common causes of project delays?',
  ];

  const selectedProj = projects.find((p) => p.id === activeProjectId);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#142B4A] tracking-tight flex items-center gap-2.5">
            <MessageSquareCode className="w-6 h-6 text-[#F59E0B]" />
            <span>Daily Site Assistant & Engineering Advisor</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time multimodal site copilot for pre-pour QA/QC checklists, safety protocols, and daily logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Project selector dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
            <Building2 className="w-3.5 h-3.5 text-[#142B4A]" />
            <span className="text-slate-400">Context:</span>
            <select
              value={activeProjectId}
              onChange={(e) => setActiveProjectId(e.target.value)}
              className="font-bold text-[#142B4A] bg-transparent focus:outline-none cursor-pointer max-w-[160px] truncate"
            >
              <option value="">General Construction</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleClear}
            className="p-2 text-slate-500 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors"
            title="Clear Conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompts Horizontal Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
          Suggested:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-[#F59E0B]/10 border border-slate-200 hover:border-[#F59E0B] text-slate-700 hover:text-[#142B4A] text-xs font-medium whitespace-nowrap transition-all shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Main Chat Scroll Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 overflow-y-auto space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <div className="w-14 h-14 rounded-2xl bg-[#142B4A]/5 flex items-center justify-center text-[#142B4A] mb-3">
              <HardHat className="w-8 h-8 text-[#F59E0B]" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">
              BuildMind AI Construction Assistant Ready
            </h3>
            <p className="text-xs text-slate-500 max-w-md mt-1 mb-4 leading-relaxed">
              Ask any question about concrete curing rates, pre-pour inspection requirements, OSHA fall arrest calculations, or request a daily site progress report template.
            </p>
            {selectedProj && (
              <div className="text-xs text-slate-600 bg-[#F5F7FA] px-3 py-1.5 rounded-lg border border-slate-200">
                Active Project Context: <strong>{selectedProj.name}</strong> ({selectedProj.projectType})
              </div>
            )}
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-lg bg-[#142B4A] flex items-center justify-center text-[#F59E0B] flex-shrink-0 font-bold shadow-xs">
                  <HardHat className="w-4 h-4 stroke-[2.2]" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 relative group ${
                  msg.role === 'user'
                    ? 'bg-[#142B4A] text-white rounded-tr-xs'
                    : 'bg-[#F5F7FA] text-slate-800 border border-slate-200/80 rounded-tl-xs'
                }`}
              >
                {/* Copy button */}
                {msg.role === 'model' && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="absolute top-3 right-3 p-1.5 rounded text-slate-400 hover:text-slate-700 bg-white/80 hover:bg-white shadow-2xs transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}

                <div className="prose prose-xs max-w-none space-y-2 whitespace-pre-wrap">
                  {msg.content}
                </div>

                <div
                  className={`text-[10px] mt-2 pt-2 border-t flex items-center justify-between ${
                    msg.role === 'user' ? 'border-slate-700/60 text-slate-300' : 'border-slate-200 text-slate-400'
                  }`}
                >
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {msg.role === 'model' && (
                    <span className="flex items-center gap-1 font-mono text-[9px] text-[#F59E0B]">
                      <Sparkles className="w-2.5 h-2.5" /> Gemini 3.8 Flash
                    </span>
                  )}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-white flex-shrink-0 font-bold text-xs shadow-xs">
                  DR
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex gap-3 text-xs justify-start">
            <div className="w-8 h-8 rounded-lg bg-[#142B4A] flex items-center justify-center text-[#F59E0B] flex-shrink-0 font-bold">
              <HardHat className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="bg-[#F5F7FA] border border-slate-200 rounded-2xl p-4 rounded-tl-xs flex items-center gap-2 text-slate-600">
              <span className="w-3.5 h-3.5 border-2 border-[#142B4A] border-t-transparent rounded-full animate-spin"></span>
              <span>Analyzing engineering guidelines & formulating technical response...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 p-2 shadow-xs"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a technical construction question (e.g., 'What are key check items for formwork stripping?')..."
          className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-[#142B4A] hover:bg-[#1E3E66] text-[#F59E0B] font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
