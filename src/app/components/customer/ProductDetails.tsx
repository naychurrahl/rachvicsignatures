import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react';
import { mockProducts } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { toast } from 'sonner';

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Product not found</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b px-4 py-3 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 active:scale-90 transition-transform">
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>

      {/* Image Carousel */}
      <div className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        <div className="mb-4">
          <h1 className="text-2xl mb-2">{product.name}</h1>
          <p className="text-3xl text-blue-600">${product.price.toFixed(2)}</p>
          <div className="mt-2">
            {product.stock > 0 ? (
              product.stock < 10 ? (
                <Badge variant="destructive">Only {product.stock} left</Badge>
              ) : (
                <Badge variant="secondary">In Stock ({product.stock} available)</Badge>
              )
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <Collapsible open={descriptionOpen} onOpenChange={setDescriptionOpen}>
          <CollapsibleTrigger className="w-full text-left py-3 border-t border-b flex items-center justify-between">
            <span className="text-sm">Description</span>
            <Plus className={`h-5 w-5 transition-transform ${descriptionOpen ? 'rotate-45' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="py-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">{product.description}</p>
          </CollapsibleContent>
        </Collapsible>

        {/* Quantity Selector */}
        <div className="mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quantity</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full border flex items-center justify-center active:scale-90 transition-transform"
              disabled={quantity <= 1}
            >
              <Minus className="h-5 w-5" />
            </button>
            <span className="text-xl w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="w-10 h-10 rounded-full border flex items-center justify-center active:scale-90 transition-transform"
              disabled={quantity >= product.stock}
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-950 border-t">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full h-14 text-lg"
          size="lg"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
