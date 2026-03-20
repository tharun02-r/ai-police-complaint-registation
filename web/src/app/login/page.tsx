'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CitizenLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/auth/citizen/login' : '/api/auth/citizen/register';
    const body = isLogin ? { email, password } : { email, password, name };

    try {
      const res = await fetch(`http://localhost:5001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/file-complaint';
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
        ← Back to Home
      </Link>
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
        <h1 className="text-3xl font-bold text-white mb-2 text-center tracking-tight">AP POLICE</h1>
        <h2 className="text-slate-400 mb-6 text-center">{isLogin ? 'Citizen Portal Login' : 'Citizen Registration'}</h2>
        
        {error && <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input 
              type="text" placeholder="Full Name" required 
              className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={name} onChange={e => setName(e.target.value)}
            />
          )}
          <input 
            type="email" placeholder="Email Address" required 
            className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={email} onChange={e => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" required 
            className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={password} onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/20">
            {isLogin ? 'Secure Login' : 'Register Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          <button onClick={() => setIsLogin(!isLogin)} className="hover:text-white transition-colors underline underline-offset-4">
            {isLogin ? 'Need an account? Register here.' : 'Already registered? Login here.'}
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <Link href="/police-login" className="text-indigo-400 text-sm hover:underline font-medium">
            Are you an officer? Police Portal Login
          </Link>
        </div>
      </div>
    </div>
  );
}
