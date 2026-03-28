import React, { useState } from 'react';
import PredictionForm from './PredictionForm';
import Dashboard from './Dashboard';
import UploadPortal from './UploadPortal';

function App() {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-lg mb-2">
          AI Customer Purchase Predictor
        </h1>
        <p className="mt-4 text-gray-400 text-lg max-w-3xl mx-auto font-light leading-relaxed">
          Predict high-value customer purchases interactively. Upload demographic logic, run end-to-end Machine Learning pipelines natively, compare traditional learning methods via EDA reports, and deploy inference in seconds.
        </p>
      </header>

      <div className="flex justify-center space-x-4 mb-8">
        <button 
          className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${activeTab === 'upload' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          onClick={() => setActiveTab('upload')}
        >
          📂 Database Upload
        </button>
        <button 
          className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${activeTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 ML Hackathon EDA
        </button>
        <button 
          className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${activeTab === 'predict' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          onClick={() => setActiveTab('predict')}
        >
          🔮 Prediction Portal
        </button>
      </div>

      <div className="bg-gray-800/50 p-8 rounded-3xl shadow-xl backdrop-blur-sm border border-gray-700">
        {activeTab === 'upload' && <UploadPortal onNavigate={setActiveTab} />}
        {activeTab === 'predict' && <PredictionForm />}
        {activeTab === 'dashboard' && <Dashboard />}
      </div>
      
    </div>
  )
}

export default App;
