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
    link.setAttribute('download', `Rekap_Penjualan_Smothin_${period}_${Date.now()}.csv`);
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
            <p style={{ fontSize: '0.75rem', color: '#7A6973' }}>Laporan omset & statistik transaksi Smoth.in</p>
          </div>
          <button
            onClick={handleExportCsv}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.75rem', color: '#10B981', borderColor: '#A7F3D0' }}
          >
            <FileSpreadsheet size={15} /> Export CSV
          </button>
        </div>

        {/* Period Switcher Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '6px',
          backgroundColor: '#FFF5F2',
          padding: '4px',
          borderRadius: '16px',
          border: '1px solid #FDDCD2'
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
        <div className="kpi-card" style={{ borderLeft: '4px solid #FF4365' }}>
          <span className="kpi-label">Total Omset</span>
          <span className="kpi-value" style={{ fontSize: '0.95rem' }}>{formatRp(stats.totalRevenue)}</span>
        </div>
        <div className="kpi-card" style={{ borderLeft: '4px solid #FF8800' }}>
          <span className="kpi-label">Transaksi</span>
          <span className="kpi-value">{stats.totalOrders} <span style={{ fontSize: '0.7rem', color: '#7A6973', fontWeight: 600 }}>nota</span></span>
        </div>
        <div className="kpi-card" style={{ borderLeft: '4px solid #10B981' }}>
          <span className="kpi-label">Cup Terjual</span>
          <span className="kpi-value">{stats.totalItemsSold} <span style={{ fontSize: '0.7rem', color: '#7A6973', fontWeight: 600 }}>cup</span></span>
        </div>
      </div>

      {/* Top Products Card */}
      {topProducts.length > 0 && (
        <div className="card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <TrendingUp size={16} style={{ color: '#FF4365' }} />
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1F1626' }}>
              Smoothies Terlaris ({period === 'today' ? 'Hari Ini' : period === 'month' ? 'Bulan Ini' : 'Tahun Ini'})
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
                    backgroundColor: idx === 0 ? '#FF4365' : '#FFF5F2',
                    color: idx === 0 ? 'white' : '#1F1626',
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
                  <span style={{ fontWeight: 800, color: '#FF4365' }}>{p.qty} cup</span>
                  <span style={{ fontSize: '0.7rem', color: '#7A6973', display: 'block' }}>{formatRp(p.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Transaction History List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1F1626' }}>
            Riwayat Transaksi ({filteredTransactions.length})
          </h3>
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A89AA3' }} />
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
            border: '1px dashed #FDDCD2'
          }}>
            <p style={{ color: '#7A6973', fontSize: '0.85rem' }}>
              Belum ada transaksi di periode ini.
            </p>
          </div>
        ) : (
          filteredTransactions.map(t => (
            <div key={t.id} className="card" style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1F1626' }}>{t.invoiceNo}</span>
                  <span className="badge badge-success">Lunas</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#7A6973', marginTop: '2px' }}>
                  {formatDate(t.timestamp)} • {t.items ? t.items.length : 0} Jenis Item
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#FF4365' }}>
                    {formatRp(t.totalAmount)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#7A6973' }}>
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
