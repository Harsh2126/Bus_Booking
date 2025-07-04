"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/login');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1021 0%, #1a174d 100%)', fontFamily: 'Inter, sans-serif', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', padding: '48px 0', maxWidth: 800, width: '90vw', display: 'flex', flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center', gap: 0 }}>
        {/* Form Section */}
        <div style={{ flex: 1, minWidth: 320, padding: '0 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 18 }}>Sign Up for Smartify</h2>
          <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required style={{ padding: '12px 16px', borderRadius: 12, border: 'none', fontSize: '1rem', background: 'rgba(255,255,255,0.18)', color: '#222', marginBottom: 4 }} />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '12px 16px', borderRadius: 12, border: 'none', fontSize: '1rem', background: 'rgba(255,255,255,0.18)', color: '#222', marginBottom: 4 }} />
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '12px 16px', borderRadius: 12, border: 'none', fontSize: '1rem', background: 'rgba(255,255,255,0.18)', color: '#222', width: '100%' }} />
              <span onClick={() => setShowPassword(s => !s)} style={{ position: 'absolute', right: 16, top: 12, cursor: 'pointer', color: '#888', fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</span>
            </div>
            <button type="submit" style={{ padding: '12px 0', borderRadius: 12, background: 'linear-gradient(90deg, #ffb347 0%, #ff5e62 100%)', color: '#fff', fontWeight: 700, fontSize: '1.1rem', border: 'none', marginTop: 8, boxShadow: '0 2px 12px rgba(255,94,98,0.13)', cursor: 'pointer', transition: 'background 0.2s' }}>Sign Up</button>
            {error && <div style={{ color: '#ff5e62', marginTop: 8 }}>{error}</div>}
          </form>
          <div style={{ marginTop: 18, fontSize: '1rem', color: '#ffeaea' }}>
            Already have an account? <Link href="/login" style={{ color: '#ffb347', textDecoration: 'underline' }}>Login</Link>
          </div>
        </div>
        {/* Side Section */}
        <div style={{ flex: 1, minWidth: 240, background: 'rgba(255,255,255,0.06)', borderTopRightRadius: 32, borderBottomRightRadius: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 32px' }}>
          <div style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#ffeaea', textAlign: 'center' }}>
            "Join Smartify and make your journeys smarter and easier!"
          </div>
        </div>
      </div>
    </div>
  );
} 