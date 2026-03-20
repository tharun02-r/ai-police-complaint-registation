'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PoliceLogin() {
  const [policeId, setPoliceId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Explicit format validation check on frontend before sending
    const alphanumericRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;
    if (policeId.length < 6 || !alphanumericRegex.test(policeId)) {
      setError('Police ID must be at least 6 characters and contain both letters and numbers.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/api/auth/police/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policeId, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      
      localStorage.setItem('police_token', data.token);
      localStorage.setItem('officer', JSON.stringify(data.officer));
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
        ← Back to Access Gateway
      </Link>
      <div className="bg-indigo-950/20 border border-indigo-500/30 p-8 rounded-2xl w-full max-w-md shadow-[0_0_40px_rgba(99,102,241,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <h1 className="text-3xl font-bold text-white mb-2 text-center drop-shadow-md tracking-tight">AP POLICE</h1>
        <h2 className="text-indigo-300 mb-6 text-center font-semibold tracking-widest uppercase text-sm">Secure Officer Access</h2>
        
        {error && <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-3 rounded-lg mb-4 text-sm font-medium relative z-10">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wide mb-1">Police ID</label>
            <input 
              type="text" placeholder="e.g. POLICE123" required 
              className="w-full bg-slate-900/50 border border-indigo-500/30 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono uppercase"
              value={policeId} onChange={e => setPoliceId(e.target.value.toUpperCase())}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wide mb-1">Password</label>
            <input 
              type="password" placeholder="••••••••" required 
              className="w-full bg-slate-900/50 border border-indigo-500/30 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/25 mt-2">
            Authenticate Identity
          </button>
        </form>
      </div>
    </div>
  );
}
