export interface Variation {
  id: string;
  name: string; // e.g., "Color", "Size"
  value: string; // e.g., "Red", "XL"
  sku: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  totalStock: number;
  variations: Variation[];
  image?: string;
}

export type Category = 'Apparel' | 'Electronics' | 'Home' | 'Accessories' | 'Other';
