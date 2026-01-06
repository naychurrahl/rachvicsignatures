import React from "react";

interface HeaderProps {
  companyName?: string;
  logo?: string;
}

const Header: React.FC<HeaderProps> = ({ companyName, logo }) => {
  return (
    <header className="w-full flex justify-center items-center py-4 bg-white sticky top-0 z-50 shadow-md">
      {/* Render logo if available */}
      {logo && (
        <img
          src={logo}
          alt="Logo"
          className={`h-16 ${companyName ? "mr-4" : ""}`} // 1/3 of name height
        />
      )}

      {/* Render company name if available */}
      {companyName && (
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
          {companyName}
        </h1>
      )}
    </header>
  );
};

export default Header;
