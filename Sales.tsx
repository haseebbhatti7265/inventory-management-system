import React, { useState } from 'react';
import { useInventory } from '../contexts/InventoryContext';
import { ShoppingCart, Plus, TrendingUp } from 'lucide-react';
import Modal from '../components/Modal';
import SearchFilter from '../components/SearchFilter';

const Sales: React.FC = () => {
  const { products, categories, sales, addSale } = useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    sellingPrice: '',
  });

  const filteredSales = sales.filter(sale => {
    const product = products.find(p => p.id === sale.productId);
    const matchesSearch = sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product && product.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !categoryFilter || (product && product.category === categoryFilter);
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({ productId: '', quantity: '', sellingPrice: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId || !formData.quantity || !formData.sellingPrice) {
      alert('Please fill all fields');
      return;
    }

    const product = products.find(p => p.id === formData.productId);
    if (!product) {
      alert('Product not found');
      return;
    }

    if (product.stock < parseInt(formData.quantity)) {
      alert('Insufficient stock available');
      return;
    }

    try {
      addSale({
        productId: formData.productId,
        productName: product.name,
        quantity: parseInt(formData.quantity),
        sellingPrice: parseFloat(formData.sellingPrice),
        purchasePrice: product.purchasePrice || 0,
      });

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      alert('Error recording sale: ' + (error as Error).message);
    }
  };

  const categoryOptions = categories.map(cat => ({ value: cat.name, label: cat.name }));
  const availableProducts = products.filter(product => product.stock > 0);
  const selectedProduct = products.find(p => p.id === formData.productId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales</h1>
          <p className="text-gray-600">Track your sales and revenue</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Record Sale
        </button>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterValue={categoryFilter}
        onFilterChange={setCategoryFilter}
        filterOptions={categoryOptions}
        filterPlaceholder="All Categories"
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredSales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <ShoppingCart className="h-5 w-5 text-orange-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{sale.productName}</div>
                          <div className="text-sm text-gray-500">
                            {products.find(p => p.id === sale.productId)?.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.quantity} {products.find(p => p.id === sale.productId)?.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${sale.sellingPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${sale.totalRevenue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        sale.profit > 0 ? 'text-green-600' : sale.profit < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        ${sale.profit.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sales recorded</h3>
            <p className="mt-1 text-sm text-gray-500">Start recording sales to track your revenue.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Record Sale"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Product *
            </label>
            <select
              value={formData.productId}
              onChange={(e) => {
                const product = products.find(p => p.id === e.target.value);
                setFormData(prev => ({ 
                  ...prev, 
                  productId: e.target.value,
                  sellingPrice: product ? product.price.toString() : ''
                }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="">Choose a product</option>
              {availableProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - Stock: {product.stock} {product.unit}
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Available Stock:</strong> {selectedProduct.stock} {selectedProduct.unit}
              </p>
              <p className="text-sm text-blue-700">
                <strong>Purchase Price:</strong> ${selectedProduct.purchasePrice?.toFixed(2) || '0.00'}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity *
            </label>
            <input
              type="number"
              min="1"
              max={selectedProduct?.stock || 1}
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter quantity"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selling Price (per unit) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.sellingPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, sellingPrice: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>

          {formData.quantity && formData.sellingPrice && selectedProduct && (
            <div className="bg-gray-50 p-3 rounded-md space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Total Revenue:</strong> ${(parseFloat(formData.quantity || '0') * parseFloat(formData.sellingPrice || '0')).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Expected Profit:</strong> ${(parseFloat(formData.quantity || '0') * (parseFloat(formData.sellingPrice || '0') - (selectedProduct.purchasePrice || 0))).toFixed(2)}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 transition-colors duration-200"
            >
              Record Sale
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Sales;