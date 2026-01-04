import React, { useState } from 'react';
import DataCleaner from './components/DataCleaner';
import Pipeline from './components/Pipeline';
import { LayoutDashboard, Database } from 'lucide-react';

function App() {
  const [view, setView] = useState('pipeline');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              T
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Tau CRM</h1>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setView('pipeline')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${view === 'pipeline'
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <LayoutDashboard size={18} />
              Pipeline
            </button>
            <button
              onClick={() => setView('cleaner')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${view === 'cleaner'
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <Database size={18} />
              Data Cleaner
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-6">
        {view === 'pipeline' ? <Pipeline /> : <DataCleaner />}
      </main>
    </div>
  );
}

export default App;
