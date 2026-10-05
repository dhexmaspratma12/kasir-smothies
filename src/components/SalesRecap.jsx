import React, { useState, useMemo } from 'react';
import { Calendar, DollarSign, ShoppingCart, TrendingUp, Eye, FileSpreadsheet, FileText, Search } from 'lucide-react';
import jsPDF from 'jspdf';

export default function SalesRecap({ transactions, onViewReceipt }) {
  const [period, setPeriod] = useState('today'); // 'today' | 'month' | 'year'
  const [searchQuery, setSearchQuery] = useState('');

  const now = new Date();

  // Filter transactions based on selected period
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tDate = new Date(t.timestamp || Date.now());

      const matchesSearch = t.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.cashierName && t.cashierName.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (period === 'today') {
        return tDate.getDate() === now.getDate() &&
          tDate.getMonth() === now.getMonth() &&
          tDate.getFullYear() === now.getFullYear();
      } else if (period === 'month') {
        return tDate.getMonth() === now.getMonth() &&
          tDate.getFullYear() === now.getFullYear();
      } else if (period === 'year') {
        return tDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [transactions, period, searchQuery, now]);

  // Aggregate stats
  const stats = useMemo(() => {
    const totalRevenue = filteredTransactions.reduce((sum, t) => sum + (t.totalAmount || 0), 0);
    const totalOrders = filteredTransactions.length;
    const totalItemsSold = filteredTransactions.reduce((sum, t) => {
      return sum + (t.items ? t.items.reduce((iSum, i) => iSum + i.qty, 0) : 0);
    }, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return { totalRevenue, totalOrders, totalItemsSold, avgOrderValue };
  }, [filteredTransactions]);

  // Top selling products in this period
  const topProducts = useMemo(() => {
    const map = {};
    filteredTransactions.forEach(t => {
      if (t.items) {
        t.items.forEach(i => {
          if (!map[i.name]) map[i.name] = { qty: 0, revenue: 0 };
          map[i.name].qty += i.qty;
          map[i.name].revenue += i.total || (i.price * i.qty);
        });
      }
    });
    return Object.entries(map)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 4);
  }, [filteredTransactions]);

  const formatRp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  const formatDate = (isoString) => {
    const d = new Date(isoString || Date.now());
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Export CSV Report
  const handleExportCsv = () => {
    let csv = 'No Invoice,Tanggal,Kasir,Jumlah Item,Total (Rp),Dibayar (Rp),Kembalian (Rp)\n';
    filteredTransactions.forEach(t => {
      const itemsCount = t.items ? t.items.reduce((s, i) => s + i.qty, 0) : 0;
      csv += `"${t.invoiceNo}","${formatDate(t.timestamp)}","${t.cashierName || 'Admin'}",${itemsCount},${t.totalAmount},${t.paidAmount},${t.changeAmount}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Rekap_Penjualan_${period}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Title & Period Selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.25rem', fontWeight: 800 }}>
              Rekap Penjualan
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#786C68' }}>Laporan omset & statistik transaksi</p>
          </div>
          <button
            onClick={handleExportCsv}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.75rem', color: '#27AE60', borderColor: '#A9DFBF' }}
          >
            <FileSpreadsheet size={15} /> Export CSV
          </button>
        </div>

        {/* Period Switcher Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '6px',
          backgroundColor: '#FAF6F0',
          padding: '4px',
          borderRadius: '16px',
          border: '1px solid #EAE1D7'
        }}>
          <button
            className={`btn btn-sm ${period === 'today' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setPeriod('today')}
            style={{ border: 'none', borderRadius: '12px' }}
          >
            Hari Ini
          </button>
          <button
            className={`btn btn-sm ${period === 'month' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setPeriod('month')}
            style={{ border: 'none', borderRadius: '12px' }}
          >
            Bulan Ini
          </button>
          <button
            className={`btn btn-sm ${period === 'year' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setPeriod('year')}
            style={{ border: 'none', borderRadius: '12px' }}
          >
            Tahun Ini
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ borderLeft: '4px solid #D96B43' }}>
          <span className="kpi-label">Total Omset</span>
          <span className="kpi-value" style={{ fontSize: '0.95rem' }}>{formatRp(stats.totalRevenue)}</span>
        </div>
        <div className="kpi-card" style={{ borderLeft: '4px solid #E6A15C' }}>
          <span className="kpi-label">Transaksi</span>
          <span className="kpi-value">{stats.totalOrders} <span style={{ fontSize: '0.7rem', color: '#786C68', fontWeight: 600 }}>nota</span></span>
        </div>
        <div className="kpi-card" style={{ borderLeft: '4px solid #27AE60' }}>
          <span className="kpi-label">Item Terjual</span>
          <span className="kpi-value">{stats.totalItemsSold} <span style={{ fontSize: '0.7rem', color: '#786C68', fontWeight: 600 }}>pcs</span></span>
        </div>
      </div>

      {/* Top Products Card */}
      {topProducts.length > 0 && (
        <div className="card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <TrendingUp size={16} style={{ color: '#D96B43' }} />
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#2D2422' }}>
              Produk Terlaris ({period === 'today' ? 'Hari Ini' : period === 'month' ? 'Bulan Ini' : 'Tahun Ini'})
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topProducts.map((p, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: idx === 0 ? '#D96B43' : '#F4ECE1',
                    color: idx === 0 ? 'white' : '#2D2422',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {idx + 1}
                  </span>
                  <span style={{ fontWeight: 700 }}>{p.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 800, color: '#D96B43' }}>{p.qty} pcs</span>
                  <span style={{ fontSize: '0.7rem', color: '#786C68', display: 'block' }}>{formatRp(p.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Transaction History List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2D2422' }}>
            Riwayat Transaksi ({filteredTransactions.length})
          </h3>
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A39692' }} />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '36px', fontSize: '0.82rem', borderRadius: '12px' }}
            placeholder="Cari No Invoice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredTransactions.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '30px',
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px dashed #EAE1D7'
          }}>
            <p style={{ color: '#786C68', fontSize: '0.85rem' }}>
              Belum ada transaksi di periode ini.
            </p>
          </div>
        ) : (
          filteredTransactions.map(t => (
            <div key={t.id} className="card" style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#2D2422' }}>{t.invoiceNo}</span>
                  <span className="badge badge-success">Lunas</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#786C68', marginTop: '2px' }}>
                  {formatDate(t.timestamp)} • {t.items ? t.items.length : 0} Jenis Item
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#D96B43' }}>
                    {formatRp(t.totalAmount)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#786C68' }}>
                    Tunai ({formatRp(t.paidAmount)})
                  </div>
                </div>

                <button
                  className="btn btn-outline btn-sm"
                  style={{ padding: '6px 8px' }}
                  onClick={() => onViewReceipt(t)}
                  title="Lihat Struk"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
