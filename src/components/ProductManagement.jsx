import React, { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Package, Search, Upload, Image as ImageIcon, CheckCircle, RefreshCw } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../data/initialData';

export default function ProductManagement({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const fileInputRef = useRef(null);

  const SAMPLE_IMAGES = [
    'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=500&q=80'
  ];

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Signature Smoothies',
    price: '',
    stock: '',
    image: SAMPLE_IMAGES[0],
    description: ''
  });

  const [isGalleryImage, setIsGalleryImage] = useState(false);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsGalleryImage(false);
    setFormData({
      name: '',
      category: 'Signature Smoothies',
      price: '',
      stock: '25',
      image: SAMPLE_IMAGES[0],
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsGalleryImage(product.image ? product.image.startsWith('data:') : false);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: product.image,
      description: product.description || ''
    });
    setIsModalOpen(true);
  };

  // Image file handler for direct photo upload from mobile gallery or computer
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
        setIsGalleryImage(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const payload = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock, 10) || 0,
      image: formData.image || SAMPLE_IMAGES[0],
      description: formData.description
    };

    if (editingProduct) {
      onUpdateProduct(editingProduct.id, payload);
    } else {
      onAddProduct(payload);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Yakin ingin menghapus menu "${name}"?`)) {
      onDeleteProduct(id);
    }
  };

  const formatRp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header & Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.15rem', fontWeight: 800 }}>
            Kelola Menu & Harga
          </h2>
          <p style={{ fontSize: '0.72rem', color: '#7A6973' }}>Total {products.length} menu smoothies terdaftar</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleOpenAdd} style={{ padding: '8px 12px' }}>
          <Plus size={16} /> Tambah Menu
        </button>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A89AA3' }} />
        <input
          type="text"
          className="input-field"
          style={{ paddingLeft: '36px', borderRadius: '12px', fontSize: '0.82rem' }}
          placeholder="Cari nama atau kategori smoothies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Products Table/List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredProducts.map(product => (
          <div key={product.id} className="card" style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover', backgroundColor: '#FFF5F2', flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.65rem', color: '#FF4365', fontWeight: 700, textTransform: 'uppercase' }}>
                {product.category}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1F1626', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {product.name}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '2px', fontSize: '0.78rem' }}>
                <span style={{ fontWeight: 800, color: '#FF4365' }}>{formatRp(product.price)}</span>
                <span style={{ color: '#7A6973' }}>Stok: {product.stock}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => handleOpenEdit(product)}
                style={{ padding: '6px' }}
                title="Edit Menu"
              >
                <Edit2 size={14} />
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => handleDelete(product.id, product.name)}
                style={{ padding: '6px', color: '#EF4444', borderColor: '#FECACA' }}
                title="Hapus Menu"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Product */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingProduct ? 'Edit Menu & Harga' : 'Tambah Menu Smoth.in'}
              </h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1F1626', display: 'block', marginBottom: '4px' }}>
                  Nama Smoothies / Minuman
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Contoh: Mango Berry Blast Smoothies 500ml"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1F1626', display: 'block', marginBottom: '4px' }}>
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="25000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1F1626', display: 'block', marginBottom: '4px' }}>
                    Stok (Pcs)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="25"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1F1626', display: 'block', marginBottom: '4px' }}>
                  Kategori
                </label>
                <select
                  className="input-field"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {PRODUCT_CATEGORIES.filter(c => c !== 'Semua').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Gallery Image Upload Input Section */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1F1626', display: 'block', marginBottom: '6px' }}>
                  Foto Menu (Upload dari Galeri HP / Komputer)
                </label>

                {/* Hidden Native File Input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                {/* File Upload Box */}
                <div
                  className="file-upload-box"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={22} />
                  <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>
                    Pilih Foto dari Galeri HP
                  </span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                    Klik di sini untuk upload foto dari memori galeri Anda
                  </span>
                </div>

                {/* Image Preview Container */}
                {formData.image && (
                  <div style={{
                    marginTop: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: '#FFF5F2',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    border: '1px solid #FDDCD2'
                  }}>
                    <img
                      src={formData.image}
                      alt="Preview"
                      style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={14} /> Foto Siap Digunakan
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#7A6973' }}>
                        {isGalleryImage ? 'Foto diunggah dari galeri Anda' : 'Foto menggunakan sampel'}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => fileInputRef.current?.click()}
                      style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                    >
                      <RefreshCw size={12} /> Ganti
                    </button>
                  </div>
                )}

                {/* Preset Gallery Option Accordion */}
                <div style={{ marginTop: '10px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#7A6973', fontWeight: 600 }}>
                    Atau pilih sampel foto smoothies siap pakai:
                  </span>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px', overflowX: 'auto' }}>
                    {SAMPLE_IMAGES.map((imgUrl, idx) => (
                      <img
                        key={idx}
                        src={imgUrl}
                        alt="Sample"
                        onClick={() => {
                          setFormData({ ...formData, image: imgUrl });
                          setIsGalleryImage(false);
                        }}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          objectFit: 'cover',
                          border: formData.image === imgUrl ? '2px solid #FF4365' : '1px solid #ddd'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1F1626', display: 'block', marginBottom: '4px' }}>
                  Deskripsi Menu (Opsional)
                </label>
                <textarea
                  className="input-field"
                  rows={2}
                  placeholder="Keterangan singkat komposisi buah atau manfaat kesegaran..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Simpan Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
