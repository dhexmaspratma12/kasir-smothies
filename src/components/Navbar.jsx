import React from 'react';
import { ShoppingBag, LogOut, UserCheck } from 'lucide-react';

export default function Navbar({ adminUser, onLogout }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand-badge">
          <div className="brand-icon">
            <ShoppingBag size={20} />
          </div>
          <div>
            <div className="brand-title">Ayu Jaya</div>
            <div className="brand-subtitle">Gerabah POS</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {adminUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                padding: '4px 10px',
                borderRadius: '99px',
                fontSize: '0.75rem',
                fontWeight: '700'
              }}>
                <UserCheck size={14} />
                <span>{adminUser.username}</span>
              </div>
              <button
                onClick={onLogout}
                className="btn btn-outline btn-sm"
                style={{ color: '#EF4444', borderColor: '#FCA5A5', padding: '6px' }}
                title="Keluar Admin"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
