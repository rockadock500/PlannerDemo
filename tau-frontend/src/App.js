import React, { useState } from 'react';
import DataCleaner from './components/DataCleaner';
import Pipeline from './components/Pipeline';
import Forecast from './components/Forecast';
import Companies from './components/Companies';
import Cognito from './components/Cognito';
import Archive from './components/Archive';
import { LayoutDashboard, Database, TrendingUp, Building2, Bot, Archive as ArchiveIcon } from 'lucide-react';

function App() {
  const [view, setView] = useState('pipeline');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Navigation Bar - Glassmorphism */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 shadow-sm">
        <div className="flex items-center justify-between w-full">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <img src="/tau-logo.png" alt="TAU Logo" className="h-8 w-auto object-contain" />
            <div className="flex flex-col">
              <h1 className="text-xl font-extrabold text-slate-800 tracking-tight leading-none">
                TAU <span className="text-indigo-600">COGNITO</span>
              </h1>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                Intelligence CRM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* View Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setView('pipeline')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'pipeline'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                <LayoutDashboard size={16} />
                Pipeline
              </button>
              <button
                onClick={() => setView('forecast')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'forecast'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                <TrendingUp size={16} />
                Forecast
              </button>
              <button
                onClick={() => setView('companies')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'companies'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                <Building2 size={16} />
                Companies
              </button>
              <button
                onClick={() => setView('archive')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'archive'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                <ArchiveIcon size={16} />
                Archive
              </button>
              <button
                onClick={() => setView('cognito')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'cognito'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                <Bot size={16} />
                Cognito
              </button>
              <button
                onClick={() => setView('cleaner')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'cleaner'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                <Database size={16} />
                Data
              </button>
            </div>

            {/* Premium Actions */}
            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            <button
              className="flex items-center gap-2 text-slate-400 text-sm font-medium cursor-not-allowed group relative"
              title="Coming Soon"
            >
              <span className="bg-slate-100 p-1.5 rounded-md group-hover:bg-slate-200 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              </span>
              Upload Emails
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 text-xs font-bold shadow-sm">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </div>
              AI Agent Active
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Full Width */}
      <main className="flex-1 w-full overflow-hidden flex flex-col">
        {view === 'pipeline' && <Pipeline />}
        {view === 'forecast' && <Forecast />}
        {view === 'companies' && <Companies />}
        {view === 'archive' && <Archive />}
        {view === 'cognito' && <Cognito />}
        {view === 'cleaner' && <DataCleaner />}
      </main>
    </div>
  );
}

export default App;
