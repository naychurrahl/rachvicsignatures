import { Search, ShoppingCart, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/app/contexts/AppContext";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";

interface SiteHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const NAV_LINKS = [
  { label: "New Arrivals", href: "#new-arrivals" },
  { label: "Best Sellers", href: "#best-sellers" },
  { label: "Shop All", href: "#products" },
];

export function SiteHeader({ searchQuery, onSearchChange }: SiteHeaderProps) {
  const navigate = useNavigate();
  const { cart, user, openModal, settings } = useApp();
  const cartCount = cart.reduce((n, item) => n + item.quantity, 0);
  const [brandLead, ...brandRest] = settings.siteName.split(" ");
  const brandTail = brandRest.join(" ");

  return (
    <header className="sticky top-0 z-20 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-950/80 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3 md:flex-nowrap md:gap-4">
        <button
          onClick={() => navigate("/")}
          className="order-1 flex items-center gap-2 text-lg font-semibold tracking-tight whitespace-nowrap shrink-0"
        >
          {settings.logoUrl && (
            <img src={settings.logoUrl} alt="" className="h-8 w-auto object-contain" />
          )}
          {brandTail ? (
            <>
              {brandLead} <span className="text-primary">{brandTail}</span>
            </>
          ) : (
            brandLead
          )}
        </button>

        <nav className="order-2 hidden md:flex items-center gap-5 ml-2 text-sm text-gray-600 dark:text-gray-300 shrink-0">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-primary transition-colors whitespace-nowrap">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="order-4 w-full md:order-3 md:w-auto relative min-w-0 md:flex-1 md:max-w-md md:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="pl-9 h-10 w-full"
          />
        </div>

        <div className="order-3 md:order-4 flex items-center gap-1 ml-auto md:ml-0 shrink-0">
          <button
            onClick={() => (user ? navigate("/profile") : openModal("login"))}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Account"
          >
            <UserIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={`Cart (${cartCount})`}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {cartCount}
              </Badge>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
