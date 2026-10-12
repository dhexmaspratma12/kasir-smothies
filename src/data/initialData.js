// Default sample products for Smoth.in Fresh Smoothies Bar
export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Mango Sunrise Smoothies',
    category: 'Signature Smoothies',
    price: 25000,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=500&q=80',
    description: 'Mangga Arumanis segar, greek yogurt kental, chia seeds, dan madu hutan.'
  },
  {
    id: 'prod-2',
    name: 'Wild Berry Blast Supreme',
    category: 'Signature Smoothies',
    price: 28000,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=500&q=80',
    description: 'Perpaduan strawberry, raspberry, blueberry segar dengan oat milk nabati.'
  },
  {
    id: 'prod-3',
    name: 'Avocado Choco Creamy Swirl',
    category: 'Signature Smoothies',
    price: 27000,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=500&q=80',
    description: 'Alpukat mentega pilihan berpadu saus dark chocolate premium dan taburan almond.'
  },
  {
    id: 'prod-4',
    name: 'Dragon Pitaya Glow',
    category: 'Signature Smoothies',
    price: 26000,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=500&q=80',
    description: 'Buah naga merah segar, nanas madu, yogurt dingin kaya antioksidan.'
  },
  {
    id: 'prod-5',
    name: 'Green Detox Power Cleanse',
    category: 'Green Detox',
    price: 26000,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=500&q=80',
    description: 'Kale organik, bayam jepang, apel fuji, perasan lemon segar & chia seeds.'
  },
  {
    id: 'prod-6',
    name: 'Strawberry Banana Bliss',
    category: 'Signature Smoothies',
    price: 24000,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=500&q=80',
    description: 'Strawberry segar, pisang cavendish manis alami, susu segar dingin menyegarkan.'
  },
  {
    id: 'prod-7',
    name: 'Tropical Acai Super Bowl',
    category: 'Fresh Fruit Bowls',
    price: 35000,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=500&q=80',
    description: 'Puree acai berry dengan topping irisan kiwi, pisang, granola renyah & roasted almond.'
  },
  {
    id: 'prod-8',
    name: 'Peanut Butter Protein Shake',
    category: 'Protein Shake',
    price: 32000,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=500&q=80',
    description: 'Isolate whey protein, selai kacang alami, oat roll, pisang & almond milk.'
  }
];

// Categories list tailored for Smoothies Bar
export const PRODUCT_CATEGORIES = [
  'Semua',
  'Signature Smoothies',
  'Fresh Fruit Bowls',
  'Green Detox',
  'Protein Shake'
];

// Helper date generator to simulate realistic transactions
const getOffsetDate = (daysOffset, hoursOffset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysOffset);
  d.setHours(d.getHours() - hoursOffset);
  return d.toISOString();
};

export const INITIAL_TRANSACTIONS = [
  // Today transactions
  {
    id: 'TRX-' + (Date.now() - 10000),
    invoiceNo: 'SMT-20261010-001',
    timestamp: getOffsetDate(0, 1), // 1 hour ago
    cashierName: 'Admin',
    items: [
      { id: 'prod-1', name: 'Mango Sunrise Smoothies', price: 25000, qty: 2, total: 50000 },
      { id: 'prod-2', name: 'Wild Berry Blast Supreme', price: 28000, qty: 1, total: 28000 }
    ],
    totalAmount: 78000,
    paidAmount: 100000,
    changeAmount: 22000,
    paymentMethod: 'Tunai'
  },
  {
    id: 'TRX-' + (Date.now() - 25000),
    invoiceNo: 'SMT-20261010-002',
    timestamp: getOffsetDate(0, 3), // 3 hours ago
    cashierName: 'Admin',
    items: [
      { id: 'prod-7', name: 'Tropical Acai Super Bowl', price: 35000, qty: 1, total: 35000 },
      { id: 'prod-3', name: 'Avocado Choco Creamy Swirl', price: 27000, qty: 2, total: 54000 }
    ],
    totalAmount: 89000,
    paidAmount: 100000,
    changeAmount: 11000,
    paymentMethod: 'Tunai'
  },
  // Earlier this month transactions
  {
    id: 'TRX-' + (Date.now() - 200000000),
    invoiceNo: 'SMT-20261007-015',
    timestamp: getOffsetDate(3), // 3 days ago
    cashierName: 'Admin',
    items: [
      { id: 'prod-8', name: 'Peanut Butter Protein Shake', price: 32000, qty: 2, total: 64000 },
      { id: 'prod-5', name: 'Green Detox Power Cleanse', price: 26000, qty: 1, total: 26000 }
    ],
    totalAmount: 90000,
    paidAmount: 100000,
    changeAmount: 10000,
    paymentMethod: 'Tunai'
  },
  {
    id: 'TRX-' + (Date.now() - 500000000),
    invoiceNo: 'SMT-20261003-009',
    timestamp: getOffsetDate(7), // 7 days ago
    cashierName: 'Admin',
    items: [
      { id: 'prod-4', name: 'Dragon Pitaya Glow', price: 26000, qty: 3, total: 78000 },
      { id: 'prod-6', name: 'Strawberry Banana Bliss', price: 24000, qty: 2, total: 48000 }
    ],
    totalAmount: 126000,
    paidAmount: 150000,
    changeAmount: 24000,
    paymentMethod: 'Tunai'
  },
  // Earlier this year transactions
  {
    id: 'TRX-' + (Date.now() - 5000000000),
    invoiceNo: 'SMT-20260815-004',
    timestamp: getOffsetDate(56), // past month
    cashierName: 'Admin',
    items: [
      { id: 'prod-1', name: 'Mango Sunrise Smoothies', price: 25000, qty: 4, total: 100000 },
      { id: 'prod-7', name: 'Tropical Acai Super Bowl', price: 35000, qty: 2, total: 70000 }
    ],
    totalAmount: 170000,
    paidAmount: 200000,
    changeAmount: 30000,
    paymentMethod: 'Tunai'
  }
];
