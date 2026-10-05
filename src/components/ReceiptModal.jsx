import React, { useRef, useState } from 'react';
import { Printer, Download, Share2, Send, CheckCircle2, Phone } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ReceiptModal({ transaction, onClose }) {
  const receiptRef = useRef(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [showWhatsappInput, setShowWhatsappInput] = useState(false);

  if (!transaction) return null;

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

  // Handler for printing receipt
  const handlePrint = () => {
    window.print();
  };

  // Handler for downloading PDF receipt file
  const handleDownloadPdf = async () => {
    if (!receiptRef.current) return;
    setIsGeneratingPdf(true);

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 160] // thermal receipt size 80mm
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 80, (canvas.height * 80) / canvas.width);
      pdf.save(`Struk_${transaction.invoiceNo}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Gagal mengunduh PDF. Silakan coba cetak struk.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Handler for WhatsApp sending
  const handleSendWhatsapp = (e) => {
    e.preventDefault();
    if (!whatsappNumber) return;

    // Build plain text receipt for WhatsApp message
    const itemLines = transaction.items
      .map(item => `- ${item.name} (${item.qty}x @${formatRp(item.price)}) = ${formatRp(item.total || item.price * item.qty)}`)
      .join('\n');

    const message = `*AYU JAYA GERABAH*\n` +
      `*Struk Pembelian / Nota*\n` +
      `--------------------------------\n` +
      `No Nota: ${transaction.invoiceNo}\n` +
      `Tanggal: ${formatDate(transaction.timestamp)}\n` +
      `Kasir: ${transaction.cashierName || 'Admin'}\n\n` +
      `*Daftar Belanja:*\n${itemLines}\n\n` +
      `*TOTAL:* ${formatRp(transaction.totalAmount)}\n` +
      `*Dibayar:* ${formatRp(transaction.paidAmount)}\n` +
      `*Kembalian:* ${formatRp(transaction.changeAmount)}\n` +
      `--------------------------------\n` +
      `Terima kasih telah berbelanja kerajinan gerabah di Ayu Jaya Gerabah!`;

    const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

    window.open(waUrl, '_blank');
  };

  return (
    <div className="modal-overlay" style={{ alignItems: 'center' }} onClick={onClose}>
      <div className="modal-content" style={{ borderRadius: '24px', maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={22} style={{ color: '#27AE60' }} />
            <div>
              <h3 className="modal-title">Transaksi Berhasil</h3>
              <p style={{ fontSize: '0.75rem', color: '#786C68' }}>{transaction.invoiceNo}</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Thermal Receipt Component View */}
        <div style={{ padding: '10px 0', display: 'flex', justifyContent: 'center' }}>
          <div ref={receiptRef} className="thermal-receipt printable-receipt">
            <div className="receipt-header">
              <div className="receipt-store">AYU JAYA GERABAH</div>
              <div className="receipt-address">
                Pusat Kerajinan Gerabah & Terracotta<br />
                Jl. Raya Gerabah No. 88 | Telp: 0812-3456-7890
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', marginBottom: '6px' }}>
              <div>No: {transaction.invoiceNo}</div>
              <div>Tgl: {formatDate(transaction.timestamp)}</div>
              <div>Kasir: {transaction.cashierName || 'Admin'}</div>
            </div>

            <div className="receipt-divider"></div>

            {/* Line items */}
            <div style={{ marginBottom: '8px' }}>
              {transaction.items.map((item, idx) => (
                <div key={idx} style={{ marginBottom: '4px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{item.name}</div>
                  <div className="receipt-row">
                    <span>{item.qty} x {formatRp(item.price)}</span>
                    <span>{formatRp(item.total || item.price * item.qty)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="receipt-divider"></div>

            <div className="receipt-row" style={{ fontWeight: 'bold' }}>
              <span>TOTAL</span>
              <span>{formatRp(transaction.totalAmount)}</span>
            </div>
            <div className="receipt-row">
              <span>Dibayar (Tunai)</span>
              <span>{formatRp(transaction.paidAmount)}</span>
            </div>
            <div className="receipt-row" style={{ fontWeight: 'bold' }}>
              <span>KEMBALIAN</span>
              <span>{formatRp(transaction.changeAmount)}</span>
            </div>

            <div className="receipt-footer">
              *** TERIMA KASIH ***<br />
              Barang yang sudah dibeli<br />
              dapat ditukar jika ada cacat produksi.
            </div>
          </div>
        </div>

        {/* Actions Toolbar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              onClick={handlePrint}
              className="btn btn-primary"
              style={{ fontSize: '0.85rem' }}
            >
              <Printer size={16} /> Cetak Struk
            </button>
            <button
              onClick={handleDownloadPdf}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem' }}
              disabled={isGeneratingPdf}
            >
              <Download size={16} /> {isGeneratingPdf ? 'Membuat PDF...' : 'Download PDF'}
            </button>
          </div>

          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '0.85rem', color: '#27AE60', borderColor: '#A9DFBF' }}
            onClick={() => setShowWhatsappInput(!showWhatsappInput)}
          >
            <Share2 size={16} /> Kirim Struk via WhatsApp
          </button>

          {/* WhatsApp Phone Form Drawer */}
          {showWhatsappInput && (
            <form onSubmit={handleSendWhatsapp} style={{
              backgroundColor: '#EAFAF1',
              padding: '12px',
              borderRadius: '14px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}>
              <Phone size={18} style={{ color: '#27AE60' }} />
              <input
                type="tel"
                className="input-field"
                style={{ fontSize: '0.85rem', flex: 1 }}
                placeholder="Nomor WA (contoh: 08123456789)"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-success btn-sm">
                <Send size={14} /> Kirim
              </button>
            </form>
          )}

          <button
            onClick={onClose}
            className="btn btn-outline"
            style={{ marginTop: '4px' }}
          >
            Selesai / Transaksi Baru
          </button>
        </div>
      </div>
    </div>
  );
}
