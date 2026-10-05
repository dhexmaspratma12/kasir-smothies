import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import LoginModal from './components/LoginModal';
import PosView from './components/PosView';
import ProductManagement from './components/ProductManagement';
import SalesRecap from './components/SalesRecap';
import ReceiptModal from './components/ReceiptModal';

import { INITIAL_PRODUCTS, INITIAL_TRANSACTIONS } from './data/initialData';

export default function App() {
  // Authentication State
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('ayu_jaya_admin');
    return saved ? JSON.parse(saved) : { username: 'Admin', role: 'Super Admin' }; // default logged in
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Products State
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('ayu_jaya_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Transactions State
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('ayu_jaya_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Cart State
  const [cart, setCart] = useState([]);

  // Active Tab View: 'kasir' | 'produk' | 'rekap'
  const [activeTab, setActiveTab] = useState('kasir');

  // Receipt Modal State
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Sync products & transactions to localStorage
  useEffect(() => {
    localStorage.setItem('ayu_jaya_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ayu_jaya_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Auth handlers
  const handleLoginSuccess = (user) => {
    setAdminUser(user);
    localStorage.setItem('ayu_jaya_admin', JSON.stringify(user));
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('ayu_jaya_admin');
    setAdminUser(null);
    setIsLoginModalOpen(true);
  };

  // Cart handlers
  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const updateCartQty = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item => (item.id === productId ? { ...item, qty: newQty } : item))
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Checkout handler
  const handleCompleteCheckout = ({ items, totalAmount, paidAmount, changeAmount, paymentMethod }) => {
    // Generate sequential invoice number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const seq = String(transactions.length + 1).padStart(3, '0');
    const invoiceNo = `AJG-${dateStr}-${seq}`;

    const newTransaction = {
      id: 'TRX-' + Date.now(),
      invoiceNo,
      timestamp: new Date().toISOString(),
      cashierName: adminUser ? adminUser.username : 'Admin',
      items: items.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        qty: i.qty,
        total: i.price * i.qty
      })),
      totalAmount,
      paidAmount,
      changeAmount,
      paymentMethod
    };

    // Deduct stock for purchased items
    setProducts(prevProducts =>
      prevProducts.map(p => {
        const cartItem = items.find(ci => ci.id === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.qty) };
        }
        return p;
      })
    );

    // Save transaction
    setTransactions(prev => [newTransaction, ...prev]);

    // Clear cart & open receipt modal
    setCart([]);
    setActiveReceipt(newTransaction);
  };

  // Product CRUD handlers
  const handleAddProduct = (newProduct) => {
    const productObj = {
      id: 'prod-' + Date.now(),
      ...newProduct
    };
    setProducts(prev => [productObj, ...prev]);
  };

  const handleUpdateProduct = (id, updatedFields) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const handleDeleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="app-viewport">
      <Navbar
        adminUser={adminUser}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {activeTab === 'kasir' && (
          <PosView
            products={products}
            cart={cart}
            addToCart={addToCart}
            updateCartQty={updateCartQty}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            onCompleteCheckout={handleCompleteCheckout}
          />
        )}

        {activeTab === 'produk' && (
          <ProductManagement
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === 'rekap' && (
          <SalesRecap
            transactions={transactions}
            onViewReceipt={(tx) => setActiveReceipt(tx)}
          />
        )}
      </main>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartItemCount={cart.reduce((s, i) => s + i.qty, 0)}
      />

      <LoginModal
        isOpen={isLoginModalOpen || !adminUser}
        onLoginSuccess={handleLoginSuccess}
      />

      {activeReceipt && (
        <ReceiptModal
          transaction={activeReceipt}
          onClose={() => setActiveReceipt(null)}
        />
      )}
    </div>
  );
}
