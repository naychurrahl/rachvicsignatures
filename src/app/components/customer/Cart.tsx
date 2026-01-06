import { Plus, Minus, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'motion/react';

export function Cart() {
  const { cart, updateQuantity, removeFromCart } = useApp();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)]">
        <div className="text-gray-400 mb-4">
          <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg mb-2">Your cart is empty</h3>
        <p className="text-sm text-gray-500 mb-6">Add items to get started</p>
        <Button onClick={() => navigate('/')}>Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="p-4">
        <AnimatePresence mode="popLayout">
          {cart.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex gap-4 mb-4 bg-white dark:bg-gray-900 rounded-lg border p-3"
            >
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm mb-1 truncate">{item.name}</h3>
                <p className="text-lg mb-2">${item.price.toFixed(2)}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 rounded-full border flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="w-8 h-8 rounded-full border flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="self-start p-2 text-red-500 active:scale-90 transition-transform"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Summary */}
      <div className="fixed bottom-20 left-0 right-0 bg-white dark:bg-gray-950 border-t p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg">Subtotal</span>
          <span className="text-2xl">${subtotal.toFixed(2)}</span>
        </div>
        <Button onClick={() => navigate('/checkout')} className="w-full h-14 text-lg" size="lg">
          Checkout
        </Button>
      </div>
    </div>
  );
}
