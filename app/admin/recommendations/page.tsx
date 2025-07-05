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

  if (loading) return <div style={{ color: '#94a3b8', padding: 32 }}>Loading recommendations...</div>;
  if (error) return <div style={{ color: '#ef4444', padding: 32 }}>{error}</div>;

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: 'white', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Recommendations</h2>
      {recommendations.length === 0 ? (
        <div style={{ color: '#94a3b8' }}>No recommendations found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {recommendations.map(rec => (
            <div key={rec._id} style={{ background: '#334155', borderRadius: 12, padding: 24, color: 'white', display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <span style={{ fontSize: 32 }}>{rec.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 18 }}>{rec.route}</div>
                  <div style={{ color: '#94a3b8', fontSize: 15 }}>{rec.desc}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  style={{ background: '#fbbf24', color: '#222', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => alert('Edit feature coming soon!')}
                >
                  Edit
                </button>
                <button
                  style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}
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
  );
} 