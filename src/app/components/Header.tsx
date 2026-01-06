// Header.tsx
import React, { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps {
  logo?: React.ReactNode;
  navItems?: NavItem[];
  right?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ logo, navItems = [], right }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">{logo && <>{logo}</>}</div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="text-gray-700 hover:text-blue-500 font-medium transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Actions / Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {right && <>{right}</>}
            <button
              className="md:hidden text-gray-700 hover:text-blue-500 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <HiX className="h-6 w-6" />
              ) : (
                <HiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="px-4 py-4 space-y-2">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="block text-gray-700 hover:text-blue-500 font-medium transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
