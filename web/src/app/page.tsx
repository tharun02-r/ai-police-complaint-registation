'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [language, setLanguage] = useState('English');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white selection:bg-indigo-500 selection:text-white pb-20">
      {/* Navbar segment */}
      <nav className="flex justify-between items-center p-6 lg:px-12 backdrop-blur-md bg-white/5 border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="AP POLICE" className="h-12 w-auto object-contain" />
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white/10 border border-white/20 text-sm rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer backdrop-blur-xl"
          >
            <option className="text-black bg-white" value="English">English</option>
            <option className="text-black bg-white" value="Hindi">हिंदी</option>
            <option className="text-black bg-white" value="Telugu">తెలుగు</option>
          </select>
          <Link href="/police-login" className="text-sm font-semibold hover:text-indigo-300 transition-colors">
            Police Portal
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-4 mt-20 sm:mt-32 text-center">
        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-medium text-emerald-400">AI Processing Active</span>
        </div>
        
        <div className="text-center max-w-4xl mx-auto space-y-8 mt-12">
          <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-cyan-400 tracking-tight leading-tight">
            File complaints we are here with you
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
            Speak or type your issue in your native language. Our AI will automatically translate, categorize, and route your complaint to the appropriate authorities with real-time validation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link 
            href="/login"
            className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-lg overflow-hidden transition-all shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_50px_rgba(79,70,229,0.6)] hover:-translate-y-1"
          >
            <span className="relative z-10 flex items-center space-x-2">
              <span>Login to File Complaint</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
          <Link 
            href="/track"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-bold text-lg transition-all hover:-translate-y-1"
          >
            Track Status
          </Link>
        </div>

        {/* Features micro-cards */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl w-full text-left">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 border border-purple-500/30">
              <span className="text-2xl">🌐</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Multilingual Input</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Type or use voice input in Telugu, Hindi, or English. We automatically translate it for the police.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4 border border-cyan-500/30">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-xl font-bold mb-2">AI Guidance</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Our AI acts as an assistant, asking you relevant follow-up questions to ensure all critical details are captured.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/30">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Real-time Priority</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Urgent situations are automatically detected via sentiment analysis and immediately escalated to the top.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
