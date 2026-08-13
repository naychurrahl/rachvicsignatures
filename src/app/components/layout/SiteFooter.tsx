import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube, Linkedin, Music2, MessageCircle,
  Link2, LucideIcon,
} from "lucide-react";
import { useApp } from "@/app/contexts/AppContext";
import { ApiRequest, baseUrl } from "@/app/contexts/ApiRequest";
import { StarRating } from "@/app/components/layout/StarRating";
import { ReviewsResponse } from "@/app/data/interFaces";

const PLATFORM_ICONS: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  tiktok: Music2,
  whatsapp: MessageCircle,
};

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  twitter: "X (Twitter)",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
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
          <p className="text-white font-semibold mb-1">{settings.siteName}</p>
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
            <a href={`mailto:${settings.contactEmail}`} className="hover:text-white flex items-start gap-2">
              <Mail className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="break-all">{settings.contactEmail}</span>
            </a>
            <a href={`tel:${settings.contactPhone}`} className="hover:text-white flex items-start gap-2">
              <Phone className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="break-words">{settings.contactPhone}</span>
            </a>
            <span className="flex items-start gap-2">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="break-words">{settings.location}</span>
            </span>
          </div>
        </div>

        <div>
          <p className="text-white font-semibold mb-3">Policies</p>
          <nav className="flex flex-col gap-2 text-sm mb-4">
            {Object.values(settings.policies).map((policy) => (
              <Link key={policy.slug} to={`/policies/${policy.slug}`} className="hover:text-white">
                {policy.title}
              </Link>
            ))}
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
        © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
      </div>
    </footer>
  );
}
