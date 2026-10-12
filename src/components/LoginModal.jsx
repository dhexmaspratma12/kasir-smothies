import React, { useState } from 'react';
import { Lock, User, KeyRound, AlertCircle, CupSoda } from 'lucide-react';

export default function LoginModal({ isOpen, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanUser = username.trim();

    // Check valid credentials (Admin / Admin123)
    if (cleanUser.toLowerCase() === 'admin' && password === 'Admin123') {
      setError('');
      onLoginSuccess({ username: 'Admin', role: 'Super Admin' });
    } else {
      setError('Username atau Password salah! Akses ditolak.');
    }
  };

  return (
    <div className="modal-overlay" style={{
      alignItems: 'center',
      backgroundColor: 'rgba(31, 22, 38, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 999
    }}>
      <div className="modal-content" style={{
        borderRadius: '24px',
        maxWidth: '400px',
        padding: '28px 24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #FF4365, #FF7253)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px auto',
            boxShadow: '0 10px 25px rgba(255, 67, 101, 0.35)'
          }}>
            <CupSoda size={34} />
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.45rem', fontWeight: 800, color: '#1F1626', marginBottom: '4px' }}>
            Masuk Kasir Admin
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#7A6973' }}>
            Smoth.in POS System
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#EF4444',
            padding: '12px 14px',
            borderRadius: '14px',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '18px',
            fontWeight: '600'
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#A89AA3' }} />
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '42px', height: '46px', fontSize: '0.9rem' }}
                placeholder="Masukkan Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                required
                autoFocus
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#A89AA3' }} />
              <input
                type="password"
                className="input-field"
                style={{ paddingLeft: '42px', height: '46px', fontSize: '0.9rem' }}
                placeholder="Masukkan Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ marginTop: '8px', height: '48px', fontSize: '0.95rem', fontWeight: 700, borderRadius: '14px' }}
          >
            <Lock size={18} /> Masuk ke Aplikasi
          </button>
        </form>
      </div>
    </div>
  );
}
