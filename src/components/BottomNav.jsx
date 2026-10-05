import React from 'react';
import { ShoppingCart, Package, BarChart3 } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, cartItemCount }) {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        <button
          className={`nav-item ${activeTab === 'kasir' ? 'active' : ''}`}
          onClick={() => setActiveTab('kasir')}
        >
          <ShoppingCart size={20} />
          <span>Kasir</span>
          {cartItemCount > 0 && (
            <span className="nav-badge">{cartItemCount}</span>
          )}
        </button>

        <button
          className={`nav-item ${activeTab === 'produk' ? 'active' : ''}`}
          onClick={() => setActiveTab('produk')}
        >
          <Package size={20} />
          <span>Menu / Produk</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'rekap' ? 'active' : ''}`}
          onClick={() => setActiveTab('rekap')}
        >
          <BarChart3 size={20} />
          <span>Rekap Penjualan</span>
        </button>
      </div>
    </nav>
  );
}
