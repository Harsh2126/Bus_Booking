"use client";
import { useEffect, useState } from 'react';

interface Recommendation {
  _id: string;
  icon: string;
  route: string;
  desc: string;
  createdAt: string;
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/recommendations')
      .then(res => res.json())
      .then(data => setRecommendations(data.recommendations || []))
      .catch(() => setError('Failed to load recommendations.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-6 p-8 bg-gradient-to-r from-yellow-500 to-pink-500 text-white rounded-2xl shadow-lg">
        <span className="text-3xl">⭐</span>
        <h1 className="text-2xl font-bold">Recommendations</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        {loading ? (
          <div className="text-gray-400 text-center py-8">Loading recommendations...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : recommendations.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No recommendations found.</div>
        ) : (
          <div className="grid gap-6">
            {recommendations.map(rec => (
              <div key={rec._id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-6">
                  <span className="text-3xl">{rec.icon}</span>
                  <div>
                    <div className="font-semibold text-lg text-gray-900">{rec.route}</div>
                    <div className="text-gray-500 text-sm">{rec.desc}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg px-4 py-2 transition"
                    onClick={() => alert('Edit feature coming soon!')}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg px-4 py-2 transition"
                    onClick={async () => {
                      if (confirm('Are you sure you want to delete this recommendation?')) {
                        const res = await fetch(`/api/recommendations/${rec._id}`, { method: 'DELETE' });
                        if (res.ok) {
                          setRecommendations(recommendations.filter(r => r._id !== rec._id));
                        } else {
                          alert('Failed to delete recommendation.');
                        }
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 