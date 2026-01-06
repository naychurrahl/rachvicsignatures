// Mock data for the commerce system

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  category: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'new' | 'in-progress' | 'completed';
  items: CartItem[];
  deliveryMethod: 'delivery' | 'pickup';
  address?: string;
  paymentMethod: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: 'staff' | 'owner';
  status: 'active' | 'inactive';
}

export const categories = ['All', 'Electronics', 'Clothing', 'Home', 'Books'];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    stock: 15,
    category: 'Electronics',
    description: 'High-quality wireless headphones with noise cancellation and long battery life.'
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    stock: 8,
    category: 'Electronics',
    description: 'Feature-rich smartwatch with health tracking and notifications.'
  },
  {
    id: '3',
    name: 'Cotton T-Shirt',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    stock: 50,
    category: 'Clothing',
    description: 'Comfortable 100% cotton t-shirt in various colors.'
  },
  {
    id: '4',
    name: 'Coffee Maker',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400',
    stock: 12,
    category: 'Home',
    description: 'Programmable coffee maker with thermal carafe.'
  },
  {
    id: '5',
    name: 'Fiction Novel',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    stock: 30,
    category: 'Books',
    description: 'Bestselling fiction novel by acclaimed author.'
  },
  {
    id: '6',
    name: 'Running Shoes',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    stock: 20,
    category: 'Clothing',
    description: 'Lightweight running shoes with superior cushioning.'
  },
  {
    id: '7',
    name: 'Desk Lamp',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
    stock: 25,
    category: 'Home',
    description: 'Modern LED desk lamp with adjustable brightness.'
  },
  {
    id: '8',
    name: 'Bluetooth Speaker',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    stock: 5,
    category: 'Electronics',
    description: 'Portable Bluetooth speaker with 360-degree sound.'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2026-01-06',
    total: 304.98,
    status: 'new',
    deliveryMethod: 'delivery',
    address: '123 Main St, City, State 12345',
    paymentMethod: 'Credit Card',
    items: [
      { ...mockProducts[0], quantity: 2 },
      { ...mockProducts[3], quantity: 1 }
    ]
  },
  {
    id: 'ORD-002',
    date: '2026-01-05',
    total: 199.99,
    status: 'in-progress',
    deliveryMethod: 'pickup',
    paymentMethod: 'PayPal',
    items: [
      { ...mockProducts[1], quantity: 1 }
    ]
  },
  {
    id: 'ORD-003',
    date: '2026-01-04',
    total: 144.98,
    status: 'completed',
    deliveryMethod: 'delivery',
    address: '456 Oak Ave, Town, State 67890',
    paymentMethod: 'Credit Card',
    items: [
      { ...mockProducts[5], quantity: 1 },
      { ...mockProducts[2], quantity: 1 }
    ]
  }
];

export const mockStaff: Staff[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'staff',
    status: 'active'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'staff',
    status: 'active'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'staff',
    status: 'inactive'
  }
];
