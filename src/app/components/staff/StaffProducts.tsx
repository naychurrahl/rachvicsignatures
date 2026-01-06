import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Package } from 'lucide-react';
import { mockProducts } from '../../data/mockData';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { toast } from 'sonner';

export function StaffProducts() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [stockValue, setStockValue] = useState('');

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateStock = () => {
    toast.success(`Stock updated for ${selectedProduct.name}`);
    setSelectedProduct(null);
    setStockValue('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b px-4 py-3">
        <div className="flex items-center mb-3">
          <button onClick={() => navigate('/staff/dashboard')} className="p-2 -ml-2 active:scale-90 transition-transform">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg ml-2">Product Management</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              onClick={() => {
                setSelectedProduct(product);
                setStockValue(product.stock.toString());
              }}
              className="bg-white dark:bg-gray-900 rounded-lg border p-4 active:scale-98 transition-transform cursor-pointer"
            >
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm mb-1 truncate">{product.name}</h3>
                  <p className="text-lg mb-1">${product.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Stock: {product.stock}</span>
                    {product.stock < 10 && (
                      <Badge variant="destructive" className="text-xs">Low</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div>
              <div className="mb-4">
                <p className="text-sm mb-2">{selectedProduct.name}</p>
                <p className="text-xs text-gray-500">Current Stock: {selectedProduct.stock}</p>
              </div>
              <div className="mb-4">
                <Label htmlFor="stock">New Stock Level</Label>
                <Input
                  id="stock"
                  type="number"
                  value={stockValue}
                  onChange={(e) => setStockValue(e.target.value)}
                  className="mt-1"
                  min="0"
                />
              </div>
              <Button onClick={handleUpdateStock} className="w-full">
                Update Stock
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
