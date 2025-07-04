
export default function Spinner({ size = 36, color = '#ffb347', label = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div
        role="status"
        aria-live="polite"
        aria-label={label}
        style={{
          width: size,
          height: size,
          border: `4px solid #eee`,
          borderTop: `4px solid ${color}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <span style={{ marginTop: 8, color: color, fontWeight: 600, fontSize: 15 }}>{label}</span>
    </div>
  );
} 