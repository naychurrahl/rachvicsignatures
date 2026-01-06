import { useState } from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import { mockProducts, categories, Product } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pb-20">
      {/* Search Bar */}
      <div className="sticky top-0 bg-white dark:bg-gray-950 z-10 p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
      </div>

      {/* Category Chips */}
      <div className="px-4 py-3 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} onClick={() => navigate(`/product/${product.id}`)} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-900 rounded-lg border overflow-hidden active:scale-95 transition-transform cursor-pointer"
    >
      <div className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <h3 className="text-sm mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-lg">${product.price.toFixed(2)}</p>
        <div className="mt-1">
          {product.stock < 10 ? (
            <Badge variant="destructive" className="text-xs">Low Stock</Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">In Stock</Badge>
          )}
        </div>
      </div>
    </div>
  );
}
