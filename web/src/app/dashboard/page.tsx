'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Complaint {
  id: string;
  originalText: string;
  originalLanguage: string;
  translatedText: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  location?: string;
  citizen: {
    name: string;
    email: string;
  };
}

export default function PoliceDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [complaintsRes, statsRes] = await Promise.all([
        fetch('http://localhost:5001/api/complaints'),
        fetch('http://localhost:5001/api/analytics/dashboard')
      ]);
      
      if (complaintsRes.ok) {
        const cData = await complaintsRes.json();
        setComplaints(cData.complaints);
      }
      
      if (statsRes.ok) {
        const sData = await statsRes.json();
        setStats(sData);
      }
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5001/api/complaints/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchData(); // Refresh immediately after resolving
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('police_token')) {
      window.location.href = '/police-login';
      return;
    }
    
    fetchData();
    // In a real app we would use WebSockets or SSE for real-time.
    // Here we just poll every 5 seconds for the hackathon demo.
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans">
      <nav className="bg-slate-900 border-b border-slate-800 p-4 px-8 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <img src="/logo.png" alt="AP POLICE Logo" className="h-10 w-auto" />
          </Link>
          <span className="text-slate-600">|</span>
          <span className="text-indigo-400 font-bold tracking-widest text-sm">OFFICER DASHBOARD</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span className="text-xs text-emerald-400 font-bold tracking-wide uppercase">Live System</span>
          </div>
          <button onClick={() => { localStorage.clear(); window.location.href = '/police-login'; }} className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
            Logout
          </button>
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Analytics Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 hover:border-slate-700">
            <h3 className="text-slate-400 text-sm font-semibold mb-2">Total Complaints</h3>
            <div className="text-4xl font-bold text-white">{stats?.totalComplaints || 0}</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 hover:border-red-500/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl"></div>
            <h3 className="text-red-400 text-sm font-semibold mb-2 flex items-center gap-2">
              <span>⚠️</span> Urgent Actions
            </h3>
            <div className="text-4xl font-bold text-red-500">{stats?.urgentComplaints || 0}</div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 hover:border-orange-500/40">
            <h3 className="text-orange-400 text-sm font-semibold mb-2 flex items-center gap-2">
              <span>🚨</span> High Priority
            </h3>
            <div className="text-4xl font-bold text-orange-500">{stats?.highComplaints || 0}</div>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 hover:border-indigo-500/40">
            <h3 className="text-indigo-400 text-sm font-semibold mb-2 flex items-center gap-2">
              <span>📊</span> Categories
            </h3>
            <div className="text-xl font-bold text-indigo-400 mt-2">
              {stats?.categoryStats?.length || 0} Active Types
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Recent Complaints 
              <span className="text-xs font-normal px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-center">Auto-Translated to English</span>
            </h2>
            <div className="flex space-x-3">
               <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm rounded-lg transition-colors border border-slate-700">Filter</button>
               <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20">Export CSV</button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/80 text-slate-400 text-sm">
                <tr>
                  <th className="p-4 font-semibold">Priority</th>
                  <th className="p-4 font-semibold">Translation (English)</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Original</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {complaints.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-500 font-medium">
                      No complaints registered yet. The city is peaceful. 🕊️
                    </td>
                  </tr>
                ) : (
                  complaints.map(c => (
                    <React.Fragment key={c.id}>
                      <tr onClick={() => setExpandedId(expandedId === c.id ? null : c.id)} className="hover:bg-slate-800/40 cursor-pointer transition-colors group">
                        <td className="p-4">
                          {c.priority === 'URGENT' && <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-bold animate-pulse">URGENT</span>}
                          {c.priority === 'HIGH' && <span className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-xs font-bold">HIGH</span>}
                          {c.priority === 'NORMAL' && <span className="px-3 py-1 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-full text-xs font-semibold">NORMAL</span>}
                        </td>
                        <td className="p-4">
                          <div className="max-w-md truncate text-white font-medium pr-4">{c.translatedText}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md text-xs font-semibold">{c.category || 'Unknown'}</span>
                        </td>
                        <td className="p-4">
                          <div className="text-xs text-slate-400 uppercase tracking-widest bg-slate-800 px-2 py-1 rounded inline-block">{c.originalLanguage}</div>
                        </td>
                        <td className="p-4">
                          <span className="flex items-center gap-2 text-sm font-medium">
                            <span className={`w-2 h-2 rounded-full ${c.status === 'PENDING' ? 'bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.8)]' : 'bg-emerald-500'}`}></span>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {c.status === 'PENDING' ? (
                            <button onClick={(e) => { e.stopPropagation(); updateStatus(c.id, 'RESOLVED'); }} className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all opacity-0 group-hover:opacity-100">
                              Complete Case
                            </button>
                          ) : (
                            <button onClick={(e) => { e.stopPropagation(); updateStatus(c.id, 'PENDING'); }} className="px-3 py-1.5 bg-emerald-500/10 hover:bg-yellow-500/20 text-emerald-400 hover:text-yellow-400 border border-emerald-500/30 hover:border-yellow-500/30 rounded-full text-xs font-bold transition-all">
                              Closed (Reopen)
                            </button>
                          )}
                        </td>
                      </tr>
                      {expandedId === c.id && (
                        <tr className="bg-slate-800/20 border-b border-slate-800/50 shadow-inner">
                          <td colSpan={6} className="p-6">
                            <div className="grid grid-cols-2 gap-8 text-sm">
                              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                <h4 className="text-indigo-400 font-bold mb-3 uppercase tracking-wider text-xs">Complainant Details</h4>
                                <div className="space-y-2">
                                  <p className="text-white"><span className="text-slate-500 w-20 inline-block font-medium">Name:</span> {c.citizen?.name || 'Anonymous'}</p>
                                  <p className="text-white"><span className="text-slate-500 w-20 inline-block font-medium">Email:</span> {c.citizen?.email}</p>
                                  <p className="text-white"><span className="text-slate-500 w-20 inline-block font-medium">Location:</span> {c.location || 'Pending AI Extraction'}</p>
                                  <p className="text-white"><span className="text-slate-500 w-20 inline-block font-medium">Logged:</span> {new Date(c.createdAt).toLocaleString()}</p>
                                </div>
                              </div>
                              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                <h4 className="text-indigo-400 font-bold mb-3 uppercase tracking-wider text-xs">Full Incident Report</h4>
                                <div className="bg-black/30 p-3 rounded-lg border border-white/5 mb-3">
                                  <p className="text-slate-400 italic text-xs mb-1 font-semibold">{c.originalLanguage} Original</p>
                                  <p className="text-slate-300">"{c.originalText}"</p>
                                </div>
                                <div className="bg-indigo-950/20 p-3 rounded-lg border border-indigo-500/10">
                                  <p className="text-indigo-300 text-xs mb-1 font-semibold">Standardized English Translation</p>
                                  <p className="text-white font-medium leading-relaxed">{c.translatedText}</p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
