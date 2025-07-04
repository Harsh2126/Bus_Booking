"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { ThemeContext } from '../ThemeProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const palettes = {
    blueSlate: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#fbbf24',
      bgLight: '#f8fafc',
      bgDark: '#0f172a',
      textLight: '#1e293b',
      textDark: '#f1f5f9',
      card: '#fff',
      cardDark: '#1e293b',
    },
    classicCorporate: {
      primary: '#0052cc',
      secondary: '#172b4d',
      accent: '#36b37e',
      bgLight: '#f4f5f7',
      bgDark: '#222b45',
      textLight: '#172b4d',
      textDark: '#f4f5f7',
      card: '#fff',
      cardDark: '#222b45',
    },
  };
  const palette = theme === 'light' ? palettes.classicCorporate : palettes.blueSlate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push('/dashboard');
    } else {
      setError(data.error || 'Login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: theme === 'light' ? palette.bgLight : palette.bgDark, fontFamily: 'Inter, sans-serif', color: theme === 'light' ? palette.textLight : palette.textDark, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: theme === 'light' ? palette.card : palette.cardDark, borderRadius: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.13)', padding: '48px 0', maxWidth: 800, width: '90vw', display: 'flex', flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center', gap: 0 }}>
        {/* Form Section */}
        <div style={{ flex: 1, minWidth: 320, padding: '0 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 18, color: palette.primary }}>Login to Smartify</h2>
          <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '12px 16px', borderRadius: 12, border: `1.5px solid ${palette.primary}`, fontSize: '1rem', background: theme === 'light' ? palette.card : palette.cardDark, color: theme === 'light' ? palette.textLight : palette.textDark, marginBottom: 4 }} />
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '12px 16px', borderRadius: 12, border: `1.5px solid ${palette.primary}`, fontSize: '1rem', background: theme === 'light' ? palette.card : palette.cardDark, color: theme === 'light' ? palette.textLight : palette.textDark, width: '100%' }} />
              <span onClick={() => setShowPassword(s => !s)} style={{ position: 'absolute', right: 16, top: 12, cursor: 'pointer', color: palette.secondary, fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</span>
            </div>
            <button type="submit" style={{ padding: '12px 0', borderRadius: 12, background: `linear-gradient(90deg, ${palette.accent} 0%, ${palette.primary} 100%)`, color: '#fff', fontWeight: 700, fontSize: '1.1rem', border: 'none', marginTop: 8, boxShadow: '0 2px 12px rgba(255,94,98,0.13)', cursor: 'pointer', transition: 'background 0.2s' }}>Login</button>
          </form>
          <div style={{ marginTop: 18, fontSize: '1rem', color: palette.secondary }}>
            Don&apos;t have an account? <Link href="/signup" style={{ color: palette.accent, textDecoration: 'underline' }}>Sign Up</Link>
          </div>
        </div>
        {/* Side Section */}
        <div style={{ flex: 1, minWidth: 240, background: theme === 'light' ? palette.bgLight : palette.bgDark, borderTopRightRadius: 32, borderBottomRightRadius: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 32px' }}>
          <div style={{ fontSize: '1.1rem', fontStyle: 'italic', color: palette.secondary, textAlign: 'center' }}>
            "Travel is the only thing you buy that makes you richer."
          </div>
        </div>
      </div>
    </div>
  );
} 