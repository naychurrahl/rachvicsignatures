import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Link2, LucideIcon } from "lucide-react";
import { useApp } from "@/app/contexts/AppContext";
import { ApiRequest, baseUrl } from "@/app/contexts/ApiRequest";
import { StarRating } from "@/app/components/layout/StarRating";
import { ReviewsResponse } from "@/app/data/interFaces";

const PLATFORM_ICONS: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
};

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  twitter: "X (Twitter)",
};

export function SiteFooter() {
  const { categories, user, settings } = useApp();
  const [storeRating, setStoreRating] = useState(0);
  const [storeReviewCount, setStoreReviewCount] = useState(0);

  useEffect(() => {
    ApiRequest({ url: `${baseUrl}/reviews/store` })
      .then((data: ReviewsResponse) => {
        setStoreRating(data.average || 0);
        setStoreReviewCount(data.count || 0);
      })
      .catch(console.error);
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div>
          <p className="text-white font-semibold mb-1">Rachvic Signatures</p>
          {storeReviewCount > 0 && (
            <StarRating value={storeRating} count={storeReviewCount} className="mb-3" />
          )}
          <nav className="flex flex-col gap-2 text-sm">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <Link to="/cart" className="hover:text-white">
              Cart
            </Link>
            {user && (
              <Link to="/orders" className="hover:text-white">
                Orders
              </Link>
            )}
            {user && (
              <Link to="/profile" className="hover:text-white">
                Profile
              </Link>
            )}
          </nav>
        </div>

        {categories.length > 0 && (
          <div>
            <p className="text-white font-semibold mb-3">Categories</p>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              {categories.map((category) => (
                <span key={category}>{category}</span>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-white font-semibold mb-3">Contact</p>
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <a href={`mailto:${settings.contactEmail}`} className="hover:text-white flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {settings.contactEmail}
            </a>
            <a href={`tel:${settings.contactPhone}`} className="hover:text-white flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {settings.contactPhone}
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {settings.location}
            </span>
          </div>
        </div>

        <div>
          <p className="text-white font-semibold mb-3">Policies</p>
          <nav className="flex flex-col gap-2 text-sm mb-4">
            <Link to="/policies/shipping" className="hover:text-white">
              Shipping
            </Link>
            <Link to="/policies/returns" className="hover:text-white">
              Returns
            </Link>
            <Link to="/policies/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/policies/terms" className="hover:text-white">
              Terms of Service
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {settings.socialLinks.map(({ id, platform, url }) => {
              const Icon = PLATFORM_ICONS[platform] ?? Link2;
              const label = PLATFORM_LABELS[platform] ?? platform;
              return (
                <a
                  key={id}
                  href={url}
                  aria-label={label}
                  className="hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 px-4 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Rachvic Signatures. All rights reserved.
      </div>
    </footer>
  );
}
