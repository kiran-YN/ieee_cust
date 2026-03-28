import React, { useState } from 'react';
import { predictPurchase } from './api';

export default function PredictionForm() {
    const [formData, setFormData] = useState({
        age: 35,
        income: 50000,
        website_visits: 10,
        past_purchases: 3,
        days_since_last_purchase: 20
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const data = await predictPurchase(formData);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.detail || "Make sure the Backend is running and model is trained.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1">
                <h2 className="text-2xl font-bold mb-6 text-emerald-400">Target Feature Input</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {Object.keys(formData).map(key => (
                        <div key={key}>
                            <label className="block text-sm font-medium text-gray-300 capitalize mb-1">
                                {key.replace(/_/g, ' ')}
                            </label>
                            <input
                                type="number"
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                                required
                            />
                        </div>
                    ))}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-bold text-lg transition-all shadow-lg ${loading ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/50'}`}
                    >
                        {loading ? 'Analyzing...' : 'Predict Purchase'}
                    </button>
                    {error && <p className="text-red-400 font-semibold">{error}</p>}
                </form>
            </div>
            
            <div className="flex-1 flex flex-col justify-center items-center p-8 bg-gray-900 rounded-2xl border-2 border-dashed border-gray-700">
                 <h3 className="text-xl font-medium text-gray-400 mb-8 uppercase tracking-widest">Prediction Result</h3>
                 
                 {loading ? (
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500 border-solid"></div>
                 ) : result ? (
                    <div className="text-center animate-pulse">
                        <div className={`text-6xl font-black mb-4 ${result.prediction === 1 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {result.prediction === 1 ? 'LIKELY' : 'UNLIKELY'}
                        </div>
                        <p className="text-gray-300 text-2xl font-light">
                            High Value Purchase
                        </p>
                        <div className="mt-8 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-inner">
                            <span className="text-gray-400 mr-2 text-lg">Probability Score:</span>
                            <span className="text-2xl font-mono font-bold text-blue-400">{result.probability}</span>
                        </div>
                    </div>
                 ) : (
                    <p className="text-gray-600 text-center italic">Awaiting customer input metrics to generate a valid ML prediction.</p>
                 )}
            </div>
        </div>
    );
}
