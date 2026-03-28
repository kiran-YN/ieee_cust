import React, { useState } from 'react';
import { uploadDataset, trainModel } from './api';

export default function UploadPortal({ onNavigate }) {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isTraining, setIsTraining] = useState(false);
    const [trainingResult, setTrainingResult] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setStatus('');
        setTrainingResult('');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setStatus("Please select a valid CSV dataset first.");
            return;
        }

        setIsUploading(true);
        setStatus("Uploading Database...");
        try {
            const data = await uploadDataset(file);
            setStatus(`✅ ${data.info}`);
        } catch (err) {
            setStatus("❌ Upload failed: " + (err.response?.data?.detail || err.message));
        } finally {
            setIsUploading(false);
        }
    };

    const handleTrainSequence = async () => {
        setIsTraining(true);
        setTrainingResult("Automated Hackathon ML Pipeline Executing... (EDA -> Clean -> Feature Eng -> Train -> Evaluate)");
        try {
            const res = await trainModel();
            setTrainingResult(`🎉 Success! Selected Best Model: ${res.metrics.model} (F1 Score: ${res.metrics.F1_score.toFixed(3)})`);
        } catch (err) {
            setTrainingResult("❌ Training sequence aborted: " + (err.response?.data?.detail || err.message));
        } finally {
            setIsTraining(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-8 p-10 bg-gray-900 rounded-3xl border border-gray-700 shadow-2xl">
            
            <div className="text-center max-w-2xl">
                <h2 className="text-3xl font-extrabold text-blue-400 mb-4">Database Operations Portal</h2>
                <p className="text-gray-400 text-lg">
                    Select a CSV dataset containing customer features (Age, Income, Website Visits, etc.) from your laptop's file explorer. 
                    Adding data again completely overwrites the pipeline cache for fresh iterative predictions!
                </p>
            </div>

            <form onSubmit={handleUpload} className="flex flex-col items-center space-y-6 w-full max-w-md">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-500 border-dashed rounded-xl cursor-pointer bg-gray-800 hover:bg-gray-700 hover:border-blue-400 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p className="mb-2 text-sm text-gray-400 font-semibold">{file ? file.name : "Click to select CSV Database"}</p>
                        <p className="text-xs text-gray-500">Traditional Feature Inputs (.csv only)</p>
                    </div>
                    <input type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
                </label>
                
                <button 
                    type="submit" 
                    disabled={isUploading || !file}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-transform hover:scale-105 ${isUploading ? 'bg-gray-600 text-gray-300' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'}`}
                >
                    {isUploading ? "Uploading Data..." : "Upload Dataset Natively"}
                </button>
            </form>

            <div className="w-full max-w-lg text-center min-h-[40px] text-emerald-400 font-medium font-mono">
                {status}
            </div>

            {status.includes('✅') && (
                <div className="w-full max-w-xl animate-fade-in-up mt-8 p-6 bg-gray-800 rounded-2xl border border-gray-600 text-center shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-2">Step 2: Automated Analysis Pipeline</h3>
                    <p className="text-gray-400 mb-6 text-sm">
                        Execute the requested end-to-end data cleanup, synthetic feature extraction, missing-value imputation, and multi-model Traditional ML comparison algorithm.
                    </p>
                    <button 
                        onClick={handleTrainSequence}
                        disabled={isTraining}
                        className={`px-8 py-3 rounded-full font-black tracking-wide text-white shadow-lg transition-transform hover:scale-105 ${isTraining ? 'bg-emerald-800 cursor-wait' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/50'}`}
                    >
                        {isTraining ? 'PROCESSING PIPELINE...' : 'EXECUTE HACKATHON ML LOOP'}
                    </button>
                    
                    {trainingResult && (
                        <div className={`mt-6 p-4 rounded-lg font-mono text-sm ${trainingResult.includes('❌') ? 'bg-red-900/50 text-red-300' : 'bg-emerald-900/50 text-emerald-300'}`}>
                            {trainingResult}
                        </div>
                    )}

                    {trainingResult.includes('🎉') && (
                        <div className="mt-6 flex gap-4 justify-center">
                            <button onClick={() => onNavigate('dashboard')} className="text-blue-400 hover:text-white underline text-sm">View Exploratory Graphs</button>
                            <span className="text-gray-600">|</span>
                            <button onClick={() => onNavigate('predict')} className="text-indigo-400 hover:text-white underline text-sm">Jump to Prediction</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
