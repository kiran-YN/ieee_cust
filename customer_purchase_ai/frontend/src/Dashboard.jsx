import React, { useEffect, useState } from 'react';
import { getMetrics } from './api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await getMetrics();
                setMetrics(data);
            } catch (err) {
                setError("Could not load metrics. Please upload a dataset to the database and hit Train & Execute Loop!");
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    if (loading) return <div className="text-center text-gray-400 animate-pulse">Running Hackathon Analytical Queries...</div>;
    if (error) return <div className="text-red-400 text-center font-bold bg-red-900/30 p-4 rounded">{error}</div>;

    const chartData = {
        labels: ['F1 Score (Primary)', 'ROC AUC', 'Precision', 'Recall'],
        datasets: [
            {
                label: 'Winning Traditional ML Model Metric',
                data: [metrics.F1_score, metrics.ROC_AUC, metrics.Precision, metrics.Recall],
                backgroundColor: 'rgba(52, 211, 153, 0.6)',
                borderColor: 'rgba(52, 211, 153, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: { color: 'white' }
            },
            title: {
                display: true,
                text: 'Metrics for Selected Best Model',
                color: 'white',
                font: { size: 18 }
            },
        },
        scales: {
            y: {
                ticks: { color: 'gray' },
                grid: { color: '#374151' }
            },
            x: {
                ticks: { color: 'gray' },
                grid: { color: '#374151' }
            }
        }
    };

    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-3xl font-bold mb-4 text-blue-400">Model Evaluation Winners</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard title="Best Algorithm" value={metrics.model} color="text-yellow-400" />
                    <MetricCard title="F1-Score" value={metrics.F1_score.toFixed(3)} color="text-emerald-400" />
                    <MetricCard title="Precision" value={metrics.Precision.toFixed(3)} color="text-blue-400" />
                    <MetricCard title="ROC AUC" value={metrics.ROC_AUC.toFixed(3)} color="text-purple-400" />
                </div>

                <div className="bg-gray-900 p-6 rounded-2xl shadow-inner border border-gray-700 flex justify-center h-80">
                    <Bar options={chartOptions} data={chartData} />
                </div>
            </div>
            
            <hr className="border-gray-700" />

            <div>
                <h2 className="text-3xl font-bold mb-6 text-indigo-400">Exploratory Data Analysis (EDA)</h2>
                <p className="text-gray-400 mb-8 max-w-2xl">
                    Dynamic visualization of your provided database. Features robust distributions, correlation heatmaps preventing multi-collinearity, and the generated Confusion Matrix from our highest performing algorithm.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-600">
                        <h4 className="text-center font-mono text-gray-300 mb-4 tracking-wrapper">TARGET VARIABLE DISTRIBUTION</h4>
                        <img src="/api/reports/target_distribution.png" alt="Distribution" className="w-full rounded shadow-md object-contain max-h-72" />
                    </div>

                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-600">
                        <h4 className="text-center font-mono text-gray-300 mb-4 tracking-wrapper">CORRELATION HEATMAP</h4>
                        <img src="/api/reports/correlation_heatmap.png" alt="Correlation" className="w-full rounded shadow-md object-contain max-h-72" />
                    </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-xl border border-gray-600 mt-8 w-full md:w-2/3 mx-auto">
                    <h4 className="text-center font-mono text-gray-300 mb-4 tracking-wrapper text-emerald-400">BEST MODEL CONFUSION MATRIX</h4>
                    <img src={`/api/reports/confusion_matrix_${metrics.model}.png`} alt="Confusion Matrix" className="w-full rounded shadow-md object-contain max-h-80" />
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, color }) {
    return (
        <div className="bg-gray-900 rounded-xl p-6 border-b-4 border-gray-700 hover:border-blue-500 transition-colors shadow-lg">
            <h4 className="text-gray-400 font-semibold mb-2 uppercase text-xs tracking-wider">{title}</h4>
            <div className={`text-3xl font-black ${color}`}>{value}</div>
        </div>
    );
}
