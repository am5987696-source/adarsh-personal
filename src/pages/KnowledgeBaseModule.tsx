import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  HelpCircle,
  Clock,
  Layers,
  ChevronRight,
  Send,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { KnowledgeArticle } from '../types';
import { api } from '../services/api';

export const KnowledgeBaseModule: React.FC = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookmarks, setBookmarks] = useState<string[]>(['kb_concrete_curing', 'kb_fall_protection']);

  // Ask AI Follow-up states
  const [question, setQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await api.getKnowledgeArticles();
        if (res.articles && res.articles.length) {
          setArticles(res.articles);
          setSelectedArticle(res.articles[0]);
        }
      } catch (err) {
        console.error('Failed to load knowledge articles:', err);
      }
    }
    loadArticles();
  }, []);

  const categories = [
    'All',
    'Civil Engineering Fundamentals',
    'Construction Materials',
    'Concrete Technology',
    'Structural Engineering Basics',
    'Construction Safety',
    'Building Maintenance',
    'Project Management',
    'Estimation and Costing',
    'Quality Assurance',
    'Construction Regulations',
  ];

  const filteredArticles = articles.filter((a) => {
    const matchesCat = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const handleAskExpert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loadingAi) return;
    setLoadingAi(true);
    setAiAnswer('');

    try {
      const res = await api.askKnowledgeQuestion(
        question,
        selectedArticle ? selectedArticle.category : selectedCategory
      );
      if (res.success && res.answer) {
        setAiAnswer(res.answer);
      }
    } catch (err) {
      console.error('Ask expert failed:', err);
      setAiAnswer('Unable to query knowledge service at this moment.');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#142B4A] tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-[#F59E0B]" />
            <span>Civil Engineering Knowledge Center</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Searchable technical repository covering ACI, ASTM, OSHA, and IBC standards with interactive AI follow-up.
          </p>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search civil engineering topics, specifications, testing methods, or regulations..."
            className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#142B4A]"
          />
        </div>

        {/* 10 Category filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-medium ${
                selectedCategory === cat
                  ? 'bg-[#142B4A] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Articles List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-semibold">
            <span>Articles Available ({filteredArticles.length})</span>
            <span>Technical Codes</span>
          </div>

          <div className="space-y-3">
            {filteredArticles.map((art) => {
              const isSelected = selectedArticle?.id === art.id;
              const isBookmarked = bookmarks.includes(art.id);
              return (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-white border-[#142B4A] shadow-md ring-1 ring-[#142B4A]'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wide">
                      {art.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(art.id);
                      }}
                      className="text-slate-400 hover:text-[#F59E0B] transition-colors p-1"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-[#F59E0B]" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 mb-1.5 leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {art.summary}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                    <span className="font-mono text-slate-600">{art.standards}</span>
                    <span>{art.readingTime} read</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Article Reader & AI Follow-Up Question Box */}
        <div className="lg:col-span-7 space-y-6">
          {selectedArticle ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
              {/* Article Top Meta */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-wide">
                    {selectedArticle.category}
                  </span>
                  <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {selectedArticle.standards}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[#142B4A]">
                  {selectedArticle.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Reading duration: {selectedArticle.readingTime} · Peer-reviewed civil engineering guidance
                </p>
              </div>

              {/* Content body */}
              <div className="prose prose-xs max-w-none text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {selectedArticle.content}
              </div>

              {/* FAQs Section */}
              {selectedArticle.faqs && selectedArticle.faqs.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-[#F59E0B]" />
                    <span>Frequently Asked Questions</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedArticle.faqs.map((faq, i) => (
                      <div key={i} className="p-3 bg-[#F5F7FA] rounded-xl border border-slate-200/80 text-xs">
                        <p className="font-bold text-slate-900 mb-1">{faq.question}</p>
                        <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ask Civil Engineering Expert AI Form */}
              <div className="p-5 bg-gradient-to-br from-[#142B4A]/5 to-[#1E3E66]/10 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                  <h4 className="text-xs font-bold text-[#142B4A] uppercase tracking-wider">
                    Ask Civil Engineering Expert (AI Follow-Up)
                  </h4>
                </div>
                <p className="text-[11px] text-slate-600">
                  Submit specific questions regarding tolerances, code interpretations, or field testing.
                </p>

                <form onSubmit={handleAskExpert} className="flex gap-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={`Ask about ${selectedArticle.category}...`}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#142B4A]"
                  />
                  <button
                    type="submit"
                    disabled={loadingAi || !question.trim()}
                    className="bg-[#142B4A] hover:bg-[#1E3E66] text-[#F59E0B] font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                  >
                    {loadingAi ? (
                      <span className="w-3.5 h-3.5 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span>Ask</span>
                        <Send className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </form>

                {aiAnswer && (
                  <div className="mt-3 p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 space-y-2 whitespace-pre-wrap leading-relaxed shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 text-[10px] text-slate-400">
                      <span className="font-bold text-[#F59E0B] uppercase">AI Expert Response</span>
                      <span>Gemini 3.8 Flash</span>
                    </div>
                    {aiAnswer}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-700 text-sm">Select a Knowledge Article</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Explore technical articles and civil codes on the left panel.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
