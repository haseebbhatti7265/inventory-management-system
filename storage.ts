import { Product, Category, StockEntry, Sale } from '../types';
import { STORAGE_KEYS } from './config';

export const storage = {
  // Products
  getProducts: (): Product[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },

  saveProducts: (products: Product[]) => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  // Categories
  getCategories: (): Category[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  },

  saveCategories: (categories: Category[]) => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  // Stock Entries
  getStockEntries: (): StockEntry[] => {
    const data = localStorage.getItem(STORAGE_KEYS.STOCK_ENTRIES);
    return data ? JSON.parse(data) : [];
  },

  saveStockEntries: (stockEntries: StockEntry[]) => {
    localStorage.setItem(STORAGE_KEYS.STOCK_ENTRIES, JSON.stringify(stockEntries));
  },

  // Sales
  getSales: (): Sale[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SALES);
    return data ? JSON.parse(data) : [];
  },

  saveSales: (sales: Sale[]) => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  },
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};