import { Home, ShoppingCart, FileText, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Badge } from './ui/badge';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useApp();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t z-50 safe-bottom">
      <div className="grid grid-cols-4 h-16">
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center gap-1 ${
            isActive('/') ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </button>

        <button
          onClick={() => navigate('/cart')}
          className={`flex flex-col items-center justify-center gap-1 relative ${
            isActive('/cart') ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cart.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {cart.length}
              </Badge>
            )}
          </div>
          <span className="text-xs">Cart</span>
        </button>

        <button
          onClick={() => navigate('/orders')}
          className={`flex flex-col items-center justify-center gap-1 ${
            isActive('/orders') ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <FileText className="h-6 w-6" />
          <span className="text-xs">Orders</span>
        </button>

        <button
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center justify-center gap-1 ${
            isActive('/profile') ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </nav>
  );
}
