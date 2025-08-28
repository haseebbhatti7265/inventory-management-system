import React, { useState, useEffect } from 'react';
import { InventoryProvider } from './contexts/InventoryContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Stock from './pages/Stock';
import Sales from './pages/Sales';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [pageTransition, setPageTransition] = useState(false);

  const handlePageChange = (page: string) => {
    setPageTransition(true);
    setTimeout(() => {
      setCurrentPage(page);
      setPageTransition(false);
    }, 150);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'categories':
        return <Categories />;
      case 'stock':
        return <Stock />;
      case 'sales':
        return <Sales />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <InventoryProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
        
        <main 
          className={`mr-64 min-h-screen p-8 transition-all duration-200 ${
            pageTransition ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
          }`}
        >
          <div className="max-w-7xl mx-auto">
            {renderCurrentPage()}
          </div>
        </main>
      </div>
    </InventoryProvider>
  );
};

export default App;