import React, { useState } from 'react';
import { Lock, User, KeyRound, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginModal({ isOpen, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === 'Admin' && password === 'Admin123') {
      setError('');
      onLoginSuccess({ username: 'Admin', role: 'Super Admin' });
    } else {
      setError('Username atau Password salah! (Default: Admin / Admin123)');
    }
  };

  const handleFillDemo = () => {
    setUsername('Admin');
    setPassword('Admin123');
    setError('');
  };

  return (
    <div className="modal-overlay" style={{ alignItems: 'center' }}>
      <div className="modal-content" style={{ borderRadius: '24px', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #2563EB, #38BDF8)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)'
          }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>
            Login Kasir Admin
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '4px' }}>
            Ayu Jaya Gerabah POS System
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#EF4444',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
              Username Admin
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '38px' }}
                placeholder="Masukkan Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="password"
                className="input-field"
                style={{ paddingLeft: '38px' }}
                placeholder="Masukkan Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '8px' }}>
            Masuk Sekarang
          </button>
        </form>

        <div style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px dashed #E2E8F0',
          textAlign: 'center'
        }}>
          <button
            type="button"
            onClick={handleFillDemo}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.75rem', width: '100%' }}
          >
            <Sparkles size={14} /> Auto-fill Demo (Admin / Admin123)
          </button>
        </div>
      </div>
    </div>
  );
}
