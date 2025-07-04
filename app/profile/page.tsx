"use client";
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../ThemeProvider';

const palettes = {
  blueSlate: {
    name: 'Blue & Slate',
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
    name: 'Classic Corporate',
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

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const palette = theme === 'light' ? palettes.classicCorporate : palettes.blueSlate;

  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setForm({ ...data.user });
        } else {
          router.replace('/login');
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/');
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/users/${user.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const data = await res.json();
      setUser(data.user);
      setEditMode(false);
    } catch (err) {
      setError('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handlePwChange = (e: any) => {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });
  };

  const handlePwSave = async (e: any) => {
    e.preventDefault();
    setPwSaving(true);
    setPwError('');
    setPwSuccess('');
    try {
      const res = await fetch(`/api/users/${user.userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pwForm),
      });
      if (!res.ok) throw new Error('Failed to change password');
      setPwSuccess('Password changed successfully!');
      setPwForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setPwError('Failed to change password.');
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) return <div style={{ color: palette.primary, textAlign: 'center', marginTop: 64 }}>Loading...</div>;
  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', background: theme === 'light' ? palette.bgLight : palette.bgDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: theme === 'light' ? palette.textLight : palette.textDark }}>
      <div style={{ background: theme === 'light' ? palette.card : palette.cardDark, borderRadius: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', padding: '48px 36px', minWidth: 340, maxWidth: 400, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ background: `linear-gradient(90deg, ${palette.primary} 0%, ${palette.accent} 100%)`, borderRadius: '50%', width: 84, height: 84, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, boxShadow: '0 2px 12px rgba(79,140,255,0.13)' }}>
          <span style={{ fontSize: 44, color: '#fff' }}>{user.email.charAt(0).toUpperCase()}</span>
        </div>
        <h2 style={{ fontWeight: 800, fontSize: '1.6rem', marginBottom: 8, color: palette.primary, letterSpacing: '1px' }}>Profile</h2>
        <div style={{ color: theme === 'light' ? palette.secondary : palette.textDark, fontSize: '1.08rem', marginBottom: 18, textAlign: 'center', width: '100%' }}>
          {editMode ? (
            <>
              <input name="name" value={form.name || ''} onChange={handleChange} placeholder="Name" style={inputStyle(theme, palette)} />
              <input name="age" value={form.age || ''} onChange={handleChange} placeholder="Age" type="number" style={inputStyle(theme, palette)} />
              <input name="course" value={form.course || ''} onChange={handleChange} placeholder="Course" style={inputStyle(theme, palette)} />
              <input name="college" value={form.college || ''} onChange={handleChange} placeholder="College" style={inputStyle(theme, palette)} />
              <input name="email" value={form.email || ''} onChange={handleChange} placeholder="Email" style={inputStyle(theme, palette)} />
            </>
          ) : (
            <>
              <div><b>Name:</b> {user.name || '-'}</div>
              <div><b>Age:</b> {user.age || '-'}</div>
              <div><b>Course:</b> {user.course || '-'}</div>
              <div><b>College:</b> {user.college || '-'}</div>
              <div><b>Email:</b> {user.email}</div>
              <div><b>Role:</b> {user.role || 'user'}</div>
            </>
          )}
        </div>
        {error && <div style={{ color: '#ff5e62', marginBottom: 8 }}>{error}</div>}
        {editMode ? (
          <>
            <button onClick={handleSave} disabled={saving} style={buttonStyle(theme, palette)}>Save</button>
            <button onClick={() => { setEditMode(false); setForm({ ...user }); }} style={{ ...buttonStyle(theme, palette), background: '#aaa', marginTop: 8 }}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setEditMode(true)} style={buttonStyle(theme, palette)}>Edit Profile</button>
        )}
        <button onClick={handleLogout} style={{ ...buttonStyle(theme, palette), background: `linear-gradient(90deg, #ff5e62 0%, #ffb347 100%)`, marginTop: 12 }}>Logout</button>
        <button onClick={() => router.push('/dashboard')} style={{ ...buttonStyle(theme, palette), background: `linear-gradient(90deg, ${palette.primary} 0%, ${palette.accent} 100%)`, marginTop: 8 }}>Back to Dashboard</button>
        {/* Change Password Section */}
        <div style={{ marginTop: 32, width: '100%' }}>
          <h3 style={{ color: palette.primary, marginBottom: 10, fontSize: '1.1rem' }}>Change Password</h3>
          <form onSubmit={handlePwSave} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input name="oldPassword" value={pwForm.oldPassword} onChange={handlePwChange} placeholder="Old Password" type="password" style={inputStyle(theme, palette)} required />
            <input name="newPassword" value={pwForm.newPassword} onChange={handlePwChange} placeholder="New Password" type="password" style={inputStyle(theme, palette)} required />
            <button type="submit" disabled={pwSaving} style={buttonStyle(theme, palette)}>Change Password</button>
          </form>
          {pwError && <div style={{ color: '#ff5e62', marginTop: 6 }}>{pwError}</div>}
          {pwSuccess && <div style={{ color: palette.primary, marginTop: 6 }}>{pwSuccess}</div>}
        </div>
      </div>
    </div>
  );
}

const inputStyle = (theme: string, palette: any) => ({
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid #ccc',
  marginBottom: 10,
  fontSize: '1rem',
  color: theme === 'light' ? palette.textLight : palette.textDark,
  background: theme === 'light' ? palette.card : palette.cardDark,
});

const buttonStyle = (theme: string, palette: any) => ({
  width: '100%',
  padding: '12px 0',
  borderRadius: 12,
  background: `linear-gradient(90deg, ${palette.primary} 0%, ${palette.accent} 100%)`,
  color: '#fff',
  fontWeight: 700,
  fontSize: '1.08rem',
  border: 'none',
  boxShadow: '0 2px 12px rgba(79,140,255,0.13)',
  cursor: 'pointer',
  transition: 'background 0.2s',
}); 