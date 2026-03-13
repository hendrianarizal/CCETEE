import { Product } from './types';

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Cotton T-Shirt',
    category: 'Apparel',
    description: 'High-quality 100% cotton t-shirt with a comfortable fit.',
    basePrice: 25,
    totalStock: 150,
    variations: [
      { id: 'v1', name: 'Color/Size', value: 'Blue/M', sku: 'TS-BLU-M', price: 25, stock: 50 },
      { id: 'v2', name: 'Color/Size', value: 'Blue/L', sku: 'TS-BLU-L', price: 25, stock: 40 },
      { id: 'v3', name: 'Color/Size', value: 'Black/M', sku: 'TS-BLK-M', price: 25, stock: 30 },
      { id: 'v4', name: 'Color/Size', value: 'Black/L', sku: 'TS-BLK-L', price: 25, stock: 30 },
    ],
    image: 'https://picsum.photos/seed/tshirt/400/400'
  },
  {
    id: '2',
    name: 'Wireless Noise Cancelling Headphones',
    category: 'Electronics',
    description: 'Immersive sound experience with long battery life.',
    basePrice: 199,
    totalStock: 45,
    variations: [
      { id: 'v5', name: 'Color', value: 'Midnight Black', sku: 'HP-BLK', price: 199, stock: 20 },
      { id: 'v6', name: 'Color', value: 'Silver', sku: 'HP-SLV', price: 219, stock: 25 },
    ],
    image: 'https://picsum.photos/seed/headphones/400/400'
  },
  {
    id: '3',
    name: 'Minimalist Ceramic Vase',
    category: 'Home',
    description: 'Elegant ceramic vase for modern home decor.',
    basePrice: 45,
    totalStock: 80,
    variations: [
      { id: 'v7', name: 'Size', value: 'Small', sku: 'VS-SML', price: 35, stock: 30 },
      { id: 'v8', name: 'Size', value: 'Medium', sku: 'VS-MED', price: 45, stock: 30 },
      { id: 'v9', name: 'Size', value: 'Large', sku: 'VS-LRG', price: 65, stock: 20 },
    ],
    image: 'https://picsum.photos/seed/vase/400/400'
  }
];
