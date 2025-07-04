"use client";
import { useState } from 'react';
import RecommendationAdminForm from '../../../components/RecommendationAdminForm';

export default function AddRecommendationPage() {
  const [success, setSuccess] = useState(false);

  return (
    <section style={{ maxWidth: 700, margin: '0 auto', background: 'inherit', borderRadius: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: '0' }}>
      <div style={{ marginBottom: 18, fontWeight: 600, fontSize: 16 }}>Share a new route or tip for users. Recommendations appear on the dashboard.</div>
      <RecommendationAdminForm />
      {success && <div style={{ marginTop: 18, color: '#36b37e', fontWeight: 700, fontSize: 16 }}>Recommendation added successfully!</div>}
    </section>
  );
} 