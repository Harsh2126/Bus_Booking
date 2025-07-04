"use client";
import RecommendationAdminForm from '../../../components/RecommendationAdminForm';

export default function AddRecommendationPage() {
  return (
    <section style={{ maxWidth: 700, margin: '0 auto', background: 'inherit', borderRadius: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: '0' }}>
      <div style={{ marginBottom: 18, fontWeight: 600, fontSize: 16 }}>Share a new route or tip for users. Recommendations appear on the dashboard.</div>
      <RecommendationAdminForm />
    </section>
  );
} 