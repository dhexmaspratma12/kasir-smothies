import React, { useState, useMemo } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Banknote, CheckCircle, AlertCircle } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../data/initialData';

export default function PosView({
  products,
  cart,
  addToCart,
  updateCartQty,
  removeFromCart,
  clearCart,
  onCompleteCheckout
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [paidAmount, setPaidAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Tunai');

  // Filter products by category and search query
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Calculate cart summary
  const totalCartItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }, [cart]);

  const numericPaid = parseFloat(paidAmount) || 0;
  const changeAmount = numericPaid - totalAmount;

  // Format currency helper
  const formatRp = (num) => {
    return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
  };

  // Preset cash buttons
  const setQuickPaid = (amount) => {
    setPaidAmount(amount.toString());
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (numericPaid < totalAmount) {
      alert('Uang dibayar kurang dari total belanja!');
      return;
    }

    // Complete transaction
    onCompleteCheckout({
      items: cart,
      totalAmount,
      paidAmount: numericPaid,
      changeAmount,
      paymentMethod
    });

    setIsCartOpen(false);
    setPaidAmount('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Search & Category Filter Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A39692' }} />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '36px', borderRadius: '14px', fontSize: '0.82rem' }}
            placeholder="Cari produk gerabah (cobek, kendi, vas...)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Chips */}
        <div className="chip-container">
          {PRODUCT_CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Items Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          background: 'white',
          borderRadius: '16px',
          border: '1px dashed #EAE1D7'
        }}>
          <ShoppingBag size={40} style={{ color: '#D96B43', opacity: 0.5, marginBottom: '10px' }} />
          <p style={{ fontWeight: 700, color: '#2D2422', fontSize: '0.9rem' }}>Produk tidak ditemukan</p>
          <p style={{ fontSize: '0.75rem', color: '#786C68', marginTop: '4px' }}>
            Coba ubah kata kunci pencarian atau kategori
          </p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(product => {
            const inCartItem = cart.find(item => item.id === product.id);
            const inCartQty = inCartItem ? inCartItem.qty : 0;

            return (
              <div key={product.id} className="product-card">
                <div className="product-img-wrapper">
                  <img src={product.image} alt={product.name} className="product-img" />
                  <span className="product-badge">{product.category}</span>
                </div>
                <div className="product-info">
                  <div>
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-price">{formatRp(product.price)}</div>
                  </div>

                  <div className="product-action-row">
                    <span className="product-stock-text">Stok: {product.stock}</span>
                    {inCartQty > 0 ? (
                      <div className="qty-control">
                        <button
                          className="qty-btn"
                          onClick={() => updateCartQty(product.id, inCartQty - 1)}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-val">{inCartQty}</span>
                        <button
                          className="qty-btn"
                          onClick={() => addToCart(product)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ padding: '5px 8px', fontSize: '0.72rem' }}
                        onClick={() => addToCart(product)}
                      >
                        <Plus size={12} /> Tambah
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Bottom Cart Bar (when items present) */}
      {cart.length > 0 && (
        <div className="floating-cart-bar">
          <div>
            <div style={{ fontSize: '0.68rem', color: '#E6A15C', fontWeight: '700' }}>
              {totalCartItems} Item dalam Keranjang
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800 }}>
              {formatRp(totalAmount)}
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn btn-primary"
            style={{ borderRadius: '12px', padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <span>Bayar</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Cart & Checkout Drawer Modal */}
      {isCartOpen && (
        <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Keranjang Belanja</h3>
                <p style={{ fontSize: '0.72rem', color: '#786C68' }}>Review items & bayar</p>
              </div>
              <button className="close-btn" onClick={() => setIsCartOpen(false)}>✕</button>
            </div>

            {/* Cart Items List */}
            <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '14px' }}>
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <div className="cart-item-title">{item.name}</div>
                    <div className="cart-item-price">{formatRp(item.price)}</div>
                  </div>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => updateCartQty(item.id, item.qty - 1)}>
                      <Minus size={12} />
                    </button>
                    <span className="qty-val">{item.qty}</span>
                    <button className="qty-btn" onClick={() => addToCart(item)}>
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{ background: 'none', border: 'none', color: '#E74C3C', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Total Summary */}
            <div style={{
              backgroundColor: '#FAF6F0',
              border: '1px solid #EAE1D7',
              borderRadius: '14px',
              padding: '12px',
              marginBottom: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: '#786C68' }}>Total Belanja</span>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#D96B43' }}>
                  {formatRp(totalAmount)}
                </span>
              </div>
            </div>

            {/* Payment Calculator Form */}
            <form onSubmit={handleCheckoutSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2D2422', display: 'block', marginBottom: '4px' }}>
                  Uang Dibayar (Rp)
                </label>
                <div style={{ position: 'relative', marginBottom: '8px' }}>
                  <Banknote size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#D96B43' }} />
                  <input
                    type="number"
                    className="input-field"
                    style={{ paddingLeft: '38px', fontSize: '1.05rem', fontWeight: '800' }}
                    placeholder="Contoh: 100000"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    required
                  />
                </div>

                {/* Quick Cash Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ padding: '6px 2px', fontSize: '0.7rem' }}
                    onClick={() => setQuickPaid(totalAmount)}
                  >
                    Uang Pas
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ padding: '6px 2px', fontSize: '0.7rem' }}
                    onClick={() => setQuickPaid(50000)}
                  >
                    50.000
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ padding: '6px 2px', fontSize: '0.7rem' }}
                    onClick={() => setQuickPaid(100000)}
                  >
                    100.000
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ padding: '6px 2px', fontSize: '0.7rem' }}
                    onClick={() => setQuickPaid(200000)}
                  >
                    200.000
                  </button>
                </div>
              </div>

              {/* Kembalian Feedback Card */}
              <div style={{
                backgroundColor: numericPaid >= totalAmount ? '#EAFAF1' : '#FDEDEC',
                border: `1px solid ${numericPaid >= totalAmount ? '#A9DFBF' : '#FADBD8'}`,
                color: numericPaid >= totalAmount ? '#27AE60' : '#E74C3C',
                padding: '10px 14px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {numericPaid >= totalAmount ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  <div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      {numericPaid >= totalAmount ? 'Kembalian' : 'Kekurangan Uang'}
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                      {formatRp(Math.abs(changeAmount))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '10px' }}
                  onClick={clearCart}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2, padding: '10px' }}
                  disabled={numericPaid < totalAmount}
                >
                  Bayar & Cetak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
