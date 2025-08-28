import React from 'react';
import { LayoutDashboard, Package, Tags, Warehouse, ShoppingCart } from 'lucide-react';
import { config } from '../utils/config';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'categories', label: 'Categories', icon: Tags },
  { id: 'stock', label: 'Stock', icon: Warehouse },
  { id: 'sales', label: 'Sales', icon: ShoppingCart },
];

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  return (
    <nav className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg border-l border-gray-200 z-40">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">{config.app.name}</h1>
        <p className="text-sm text-gray-600">Management System</p>
      </div>
      
      <div className="py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-all duration-200 hover:bg-blue-50 ${
                isActive
                  ? 'bg-blue-600 text-white border-r-4 border-blue-800 shadow-sm'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <Icon 
                className={`mr-3 h-5 w-5 transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`} 
              />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;