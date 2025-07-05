"use client";
import RecommendationAdminForm from '../../../components/RecommendationAdminForm';

export default function AddRecommendationPage() {
  return (
    <div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '24px',
        padding: '20px',
        background: '#334155',
        borderRadius: '12px',
        border: '1px solid #475569'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '24px' }}>⭐</span>
          <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: 'white' }}>
            Add Recommendation
          </h2>
        </div>
      </div>
      
      <div style={{ 
        background: '#334155',
        borderRadius: '16px',
        border: '1px solid #475569',
        padding: '32px'
      }}>
        <div style={{ 
          marginBottom: '24px', 
          fontWeight: '500', 
          fontSize: '16px',
          color: '#94a3b8'
        }}>
          Share a new route or tip for users. Recommendations appear on the dashboard.
        </div>
      <RecommendationAdminForm />
      </div>
    </div>
  );
} 