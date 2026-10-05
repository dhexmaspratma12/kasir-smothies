// Default sample products for Ayu Jaya Gerabah
export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Cobek Batu Gerabah 20cm',
    category: 'Peralatan Dapur',
    price: 35000,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80',
    description: 'Cobek tanah liat tradisional halus, awet untuk bumbu dapur.'
  },
  {
    id: 'prod-2',
    name: 'Kendi Air Terracotta 2L',
    category: 'Wadah Air',
    price: 65000,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80',
    description: 'Kendi tanah liat alami, menjaga air tetap sejuk dan murni.'
  },
  {
    id: 'prod-3',
    name: 'Vas Bunga Ukir Terracotta',
    category: 'Hiasan Rumah',
    price: 85000,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=400&q=80',
    description: 'Vas bunga ukir tangan motif etnik Jawa elegan.'
  },
  {
    id: 'prod-4',
    name: 'Pot Bunga Clay Minimalis 25cm',
    category: 'Pot & Tanaman',
    price: 45000,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80',
    description: 'Pot tanaman terracotta berpori alami bagus untuk akar.'
  },
  {
    id: 'prod-5',
    name: 'Wajan / Kuali Tanah Liat 28cm',
    category: 'Peralatan Dapur',
    price: 75000,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?auto=format&fit=crop&w=400&q=80',
    description: 'Wajan tiup sangrai kopi atau tumis rasa otentik.'
  },
  {
    id: 'prod-6',
    name: 'Poci Teapot Set Tanah Liat',
    category: 'Peralatan Dapur',
    price: 120000,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80',
    description: 'Set poci 1 teko + 4 cangkir gula batu khas Poci Tradisional.'
  },
  {
    id: 'prod-7',
    name: 'Mangkuk Sup Clay Classic',
    category: 'Peralatan Dapur',
    price: 25000,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80',
    description: 'Mangkuk sup tahan panas aroma saji otentik.'
  },
  {
    id: 'prod-8',
    name: 'Patung Hiasan Clay Owl',
    category: 'Hiasan Rumah',
    price: 55000,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=400&q=80',
    description: 'Hiasan meubeller burung hantu lucu buatan tangan.'
  }
];

// Categories list
export const PRODUCT_CATEGORIES = [
  'Semua',
  'Peralatan Dapur',
  'Wadah Air',
  'Hiasan Rumah',
  'Pot & Tanaman'
];

// Helper date generator to simulate realistic today, month, and year transactions
const now = new Date();
const formatDate = (dateObj) => dateObj.toISOString();

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
    invoiceNo: 'AJG-20260917-001',
    timestamp: getOffsetDate(0, 1), // 1 hour ago today
    cashierName: 'Admin',
    items: [
      { id: 'prod-1', name: 'Cobek Batu Gerabah 20cm', price: 35000, qty: 2, total: 70000 },
      { id: 'prod-2', name: 'Kendi Air Terracotta 2L', price: 65000, qty: 1, total: 65000 }
    ],
    totalAmount: 135000,
    paidAmount: 150000,
    changeAmount: 15000,
    paymentMethod: 'Tunai'
  },
  {
    id: 'TRX-' + (Date.now() - 25000),
    invoiceNo: 'AJG-20260917-002',
    timestamp: getOffsetDate(0, 3), // 3 hours ago today
    cashierName: 'Admin',
    items: [
      { id: 'prod-6', name: 'Poci Teapot Set Tanah Liat', price: 120000, qty: 1, total: 120000 },
      { id: 'prod-7', name: 'Mangkuk Sup Clay Classic', price: 25000, qty: 4, total: 100000 }
    ],
    totalAmount: 220000,
    paidAmount: 250000,
    changeAmount: 30000,
    paymentMethod: 'Tunai'
  },
  // Earlier this month transactions
  {
    id: 'TRX-' + (Date.now() - 200000000),
    invoiceNo: 'AJG-20260914-012',
    timestamp: getOffsetDate(3), // 3 days ago
    cashierName: 'Admin',
    items: [
      { id: 'prod-3', name: 'Vas Bunga Ukir Terracotta', price: 85000, qty: 2, total: 170000 }
    ],
    totalAmount: 170000,
    paidAmount: 200000,
    changeAmount: 30000,
    paymentMethod: 'Tunai'
  },
  {
    id: 'TRX-' + (Date.now() - 500000000),
    invoiceNo: 'AJG-20260910-008',
    timestamp: getOffsetDate(7), // 7 days ago
    cashierName: 'Admin',
    items: [
      { id: 'prod-4', name: 'Pot Bunga Clay Minimalis 25cm', price: 45000, qty: 4, total: 180000 },
      { id: 'prod-5', name: 'Wajan / Kuali Tanah Liat 28cm', price: 75000, qty: 1, total: 75000 }
    ],
    totalAmount: 255000,
    paidAmount: 300000,
    changeAmount: 45000,
    paymentMethod: 'Tunai'
  },
  // Earlier this year transactions
  {
    id: 'TRX-' + (Date.now() - 5000000000),
    invoiceNo: 'AJG-20260715-004',
    timestamp: getOffsetDate(64), // 2 months ago
    cashierName: 'Admin',
    items: [
      { id: 'prod-2', name: 'Kendi Air Terracotta 2L', price: 65000, qty: 3, total: 195000 },
      { id: 'prod-8', name: 'Patung Hiasan Clay Owl', price: 55000, qty: 2, total: 110000 }
    ],
    totalAmount: 305000,
    paidAmount: 350000,
    changeAmount: 45000,
    paymentMethod: 'Tunai'
  }
];
