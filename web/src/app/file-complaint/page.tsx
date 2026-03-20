'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";

export default function FileComplaint() {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('English');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorPrompt, setErrorPrompt] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser does not support Speech Recognition. Please use Chrome or Edge.");
      return;
    }
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = language === 'English' ? 'en-US' : (language === 'Hindi' ? 'hi-IN' : 'te-IN');
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => prev ? prev + ' ' + transcript : transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const mockTranslate = () => {
    if (!text) {
      setErrorPrompt("Please enter some text in English first!");
      return;
    }
    if (language === 'Telugu') {
      setText("నిన్న మార్కెట్ దగ్గర నా బైక్ దొంగిలించబడింది. నా ఫోన్ కూడా అందులో ఉంది. దయచేసి విచారణ ప్రారంభించండి.");
    } else if (language === 'Hindi') {
      setText("कल बाजार के पास मेरी बाइक चोरी हो गई थी। मेरा फोन भी उसमें था। कृपया जांच शुरू करें।");
    } else {
      setErrorPrompt("Please select Hindi or Telugu from the tabs above to demonstrate auto-translation!");
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
      window.location.href = '/login';
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorPrompt(null);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const currentCitizenId = user?.id;

    if (!currentCitizenId) {
      setErrorPrompt('Unable to find active user session. Please try logging in again.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate calling our backend API
      const res = await fetch('http://localhost:5001/api/complaints/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          citizenId: currentCitizenId,
          text,
          language
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.missingFields) {
          setErrorPrompt(data.aiPrompt);
        } else {
          setErrorPrompt('An error occurred: ' + (data.error || 'Unknown error'));
        }
      } else {
        setSuccess(true);
      }
    } catch (error) {
      setErrorPrompt('Failed to connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-4">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 max-w-md text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Complaint Submitted</h2>
          <p className="text-slate-300 mb-6">Your complaint has been registered successfully. The police have been notified.</p>
          <Link href="/" className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500 selection:text-white pb-20">
      <nav className="p-6 border-b border-white/10 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="AP POLICE Logo" className="h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">New Complaint</span>
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="text-sm px-4 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-full transition-colors font-medium border border-red-500/20">Logout</button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto mt-12 p-6 bg-white/5 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-sm">
        <h1 className="text-3xl font-bold mb-2">What happened?</h1>
        <p className="text-slate-400 mb-8">Describe the incident naturally. Our AI will understand and extract the necessary details.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex space-x-4 mb-4">
            <button type="button" onClick={() => setLanguage('English')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${language === 'English' ? 'bg-indigo-600' : 'bg-white/10 hover:bg-white/20'}`}>English</button>
            <button type="button" onClick={() => setLanguage('Hindi')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${language === 'Hindi' ? 'bg-indigo-600' : 'bg-white/10 hover:bg-white/20'}`}>हिंदी</button>
            <button type="button" onClick={() => setLanguage('Telugu')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${language === 'Telugu' ? 'bg-indigo-600' : 'bg-white/10 hover:bg-white/20'}`}>తెలుగు</button>
          </div>

          <div className="relative">
            {language === 'English' ? (
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g., My bike was stolen yesterday near the central market..."
                className="w-full h-48 bg-black/50 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                required
              />
            ) : (
              <ReactTransliterate
                value={text}
                onChangeText={(t: string) => setText(t)}
                lang={language === 'Telugu' ? 'te' : 'hi'}
                renderComponent={(props: any) => (
                  <textarea 
                    {...props}
                    placeholder={`Type English words phonetically to magically convert to ${language} (e.g. "mera nam" -> "मेरा नाम")`}
                    className="w-full h-48 bg-black/50 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                    required
                  />
                )}
              />
            )}
            <button 
              type="button" 
              onClick={startListening}
              className={`absolute bottom-4 right-4 p-3 rounded-full transition-all text-xl shadow-lg border ${isListening ? 'bg-red-500/20 border-red-500/50 animate-pulse text-red-400' : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'}`} 
              title={isListening ? "Listening..." : "Click to speak"}
            >
              🎤
            </button>
          </div>

          {errorPrompt && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start space-x-3">
              <span className="text-red-400 mt-0.5">⚠️</span>
              <p className="text-red-300 text-sm leading-relaxed">{errorPrompt}</p>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <div className="flex space-x-6 items-center">
              <button type="button" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center space-x-2">
                <span>📎</span> <span>Attach Evidence</span>
              </button>
              <button 
                type="button" 
                onClick={mockTranslate}
                className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm transition-colors flex items-center space-x-2 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20"
              >
                <span>✨</span> <span>Auto-Translate to {language}</span>
              </button>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting || !text}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 rounded-full font-bold shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Submit to AI'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
