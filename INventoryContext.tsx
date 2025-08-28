import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Product, Category, StockEntry, Sale, DashboardStats } from '../types';
import { storage, generateId } from '../utils/storage';

interface InventoryContextType {
  // Data
  products: Product[];
  categories: Category[];
  stockEntries: StockEntry[];
  sales: Sale[];
  dashboardStats: DashboardStats;

  // Products
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'stock'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Categories
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Stock
  addStock: (stock: Omit<StockEntry, 'id' | 'createdAt' | 'totalCost'>) => void;

  // Sales
  addSale: (sale: Omit<Sale, 'id' | 'createdAt' | 'totalRevenue' | 'profit'>) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    setProducts(storage.getProducts());
    setCategories(storage.getCategories());
    setStockEntries(storage.getStockEntries());
    setSales(storage.getSales());
  }, []);

  // Calculate dashboard stats
  const dashboardStats: DashboardStats = React.useMemo(() => {
    const totalProducts = products.length;
    const totalCategories = categories.length;
    const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalRevenue, 0);
    const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
    const lowStockProducts = products.filter(product => product.stock <= 5);

    return {
      totalProducts,
      totalCategories,
      totalStock,
      totalSales,
      totalRevenue,
      totalProfit,
      lowStockProducts,
    };
  }, [products, categories, sales]);

  // Products
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'stock'>) => {
    const newProduct: Product = {
      ...productData,
      id: generateId(),
      stock: 0,
      createdAt: new Date().toISOString(),
    };
    
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    storage.saveProducts(updatedProducts);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, ...updates } : product
    );
    setProducts(updatedProducts);
    storage.saveProducts(updatedProducts);
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    storage.saveProducts(updatedProducts);
  };

  // Categories
  const addCategory = (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    storage.saveCategories(updatedCategories);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const updatedCategories = categories.map(category =>
      category.id === id ? { ...category, ...updates } : category
    );
    setCategories(updatedCategories);
    storage.saveCategories(updatedCategories);
  };

  const deleteCategory = (id: string) => {
    const updatedCategories = categories.filter(category => category.id !== id);
    setCategories(updatedCategories);
    storage.saveCategories(updatedCategories);
  };

  // Stock
  const addStock = (stockData: Omit<StockEntry, 'id' | 'createdAt' | 'totalCost'>) => {
    const totalCost = stockData.quantity * stockData.purchasePrice;
    const newStockEntry: StockEntry = {
      ...stockData,
      id: generateId(),
      totalCost,
      createdAt: new Date().toISOString(),
    };

    // Update product stock and purchase price
    const updatedProducts = products.map(product => {
      if (product.id === stockData.productId) {
        const currentStock = product.stock;
        const currentPurchasePrice = product.purchasePrice || 0;
        const newStock = currentStock + stockData.quantity;
        
        // Calculate weighted average purchase price
        const totalCurrentValue = currentStock * currentPurchasePrice;
        const totalNewValue = totalCurrentValue + totalCost;
        const newPurchasePrice = newStock > 0 ? totalNewValue / newStock : stockData.purchasePrice;

        return {
          ...product,
          stock: newStock,
          purchasePrice: newPurchasePrice,
        };
      }
      return product;
    });

    const updatedStockEntries = [...stockEntries, newStockEntry];
    
    setProducts(updatedProducts);
    setStockEntries(updatedStockEntries);
    storage.saveProducts(updatedProducts);
    storage.saveStockEntries(updatedStockEntries);
  };

  // Sales
  const addSale = (saleData: Omit<Sale, 'id' | 'createdAt' | 'totalRevenue' | 'profit'>) => {
    const product = products.find(p => p.id === saleData.productId);
    if (!product || product.stock < saleData.quantity) {
      throw new Error('Insufficient stock');
    }

    const totalRevenue = saleData.quantity * saleData.sellingPrice;
    const profit = saleData.quantity * (saleData.sellingPrice - saleData.purchasePrice);
    
    const newSale: Sale = {
      ...saleData,
      id: generateId(),
      totalRevenue,
      profit,
      createdAt: new Date().toISOString(),
    };

    // Update product stock
    const updatedProducts = products.map(p =>
      p.id === saleData.productId
        ? { ...p, stock: p.stock - saleData.quantity }
        : p
    );

    const updatedSales = [...sales, newSale];
    
    setProducts(updatedProducts);
    setSales(updatedSales);
    storage.saveProducts(updatedProducts);
    storage.saveSales(updatedSales);
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        categories,
        stockEntries,
        sales,
        dashboardStats,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addStock,
        addSale,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};