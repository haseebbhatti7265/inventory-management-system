export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  stock: number;
  purchasePrice?: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface StockEntry {
  id: string;
  productId: string;
  quantity: number;
  purchasePrice: number;
  totalCost: number;
  createdAt: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  sellingPrice: number;
  purchasePrice: number;
  totalRevenue: number;
  profit: number;
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalStock: number;
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  lowStockProducts: Product[];
}