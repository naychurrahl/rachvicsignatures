import { User, Settings, HelpCircle, LogOut, Moon, Sun } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function Profile() {
  const { setUserRole } = useApp();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const handleSwitchToStaff = () => {
    setUserRole('staff');
    navigate('/staff/dashboard');
  };

  const handleSwitchToOwner = () => {
    setUserRole('owner');
    navigate('/owner/dashboard');
  };

  return (
    <div className="p-4 pb-20">
      {/* User Info */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg">John Doe</h2>
            <p className="text-sm text-gray-500">john@example.com</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border overflow-hidden mb-4">
        <button className="w-full flex items-center gap-3 p-4 active:bg-gray-50 dark:active:bg-gray-800 transition-colors">
          <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <span>Settings</span>
        </button>
        <div className="border-t" />
        <button className="w-full flex items-center gap-3 p-4 active:bg-gray-50 dark:active:bg-gray-800 transition-colors">
          <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <span>Help & Support</span>
        </button>
        <div className="border-t" />
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center justify-between p-4 active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" /> : <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
            <span>Dark Mode</span>
          </div>
          <div className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-blue-600' : 'bg-gray-300'} relative`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
          </div>
        </button>
      </div>

      {/* Demo Role Switcher */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border p-4 mb-4">
        <p className="text-sm text-gray-500 mb-3">Demo: Switch Role</p>
        <div className="flex gap-2">
          <button
            onClick={handleSwitchToStaff}
            className="flex-1 py-2 px-4 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg active:scale-95 transition-transform text-sm"
          >
            Staff Login
          </button>
          <button
            onClick={handleSwitchToOwner}
            className="flex-1 py-2 px-4 bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-lg active:scale-95 transition-transform text-sm"
          >
            Owner Login
          </button>
        </div>
      </div>

      <button className="w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-center gap-3 text-red-600 active:bg-gray-50 dark:active:bg-gray-800 transition-colors">
        <LogOut className="h-5 w-5" />
        <span>Log Out</span>
      </button>
    </div>
  );
}
