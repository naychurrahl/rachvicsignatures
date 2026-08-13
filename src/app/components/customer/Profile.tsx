import { useEffect, useState } from 'react';
import { User, LayoutDashboard, LogOut, Moon, Sun } from 'lucide-react';
import { useApp } from '@/app/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { ApiRequest, baseUrl } from '@/app/contexts/ApiRequest';
import { StarRating } from '@/app/components/layout/StarRating';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';
import { ReviewsResponse } from '@/app/data/interFaces';

export function Profile() {
  const { logout, user, orders } = useApp();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const darkMode = theme === 'dark';

  const [storeRating, setStoreRating] = useState(0);
  const [storeReviewCount, setStoreReviewCount] = useState(0);
  const [alreadyReviewedStore, setAlreadyReviewedStore] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const hasCompletedOrder = orders.some(
    (o) => o.userId === user?.userId && o.status === 'completed',
  );

  useEffect(() => {
    if (!user) return;
    ApiRequest({ url: `${baseUrl}/reviews/store` })
      .then((data: ReviewsResponse) => {
        setStoreRating(data.average || 0);
        setStoreReviewCount(data.count || 0);
        setAlreadyReviewedStore(
          data.reviews?.some((r) => r.userId === user.userId) || false,
        );
      })
      .catch(console.error);
  }, [user]);

  const handleSubmitStoreReview = async () => {
    if (newRating === 0) return;
    setSubmitting(true);
    try {
      await ApiRequest({
        url: `${baseUrl}/reviews/store`,
        method: 'POST',
        body: { rating: newRating, comment: newComment },
      });
      toast.success('Thanks for rating us!');
      setAlreadyReviewedStore(true);
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleToggleTheme = async () => {
    const next = darkMode ? 'light' : 'dark';
    setTheme(next);
    try {
      await ApiRequest({
        url: `${baseUrl}/user`,
        method: 'PUT',
        body: { id: user?.userId, theme: next },
      });
    } catch (error) {
      console.error('Failed to save theme preference', error);
    }
  };

  if (!user) return null;

  const backofficeLinks =
    user.role === 'admin'
      ? [
          { label: 'Owner Dashboard', to: '/owner/dashboard' },
          { label: 'Staff Dashboard', to: '/staff/dashboard' },
        ]
      : user.role === 'staff'
        ? [{ label: 'Staff Dashboard', to: '/staff/dashboard' }]
        : [];

  return (
    <div className="p-4 pb-20">
      {/* User Info */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-lg">{user.name || user.email}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      {backofficeLinks.length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          {backofficeLinks.map((link) => (
            <button
              key={link.to}
              onClick={() => navigate(link.to)}
              className="w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-center gap-3 active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
            >
              <LayoutDashboard className="h-5 w-5 text-primary" />
              <span>{link.label}</span>
            </button>
          ))}
        </div>
      )}

      {hasCompletedOrder && !alreadyReviewedStore && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border p-4 mb-4">
          <p className="text-sm mb-2">Rate our store</p>
          <StarRating
            value={newRating}
            interactive
            onChange={setNewRating}
            size={22}
            className="mb-2"
          />
          <Textarea
            value={newComment}
            onChange={(e: any) => setNewComment(e.target.value)}
            placeholder="Tell us about your experience (optional)"
            className="mb-2"
          />
          <Button
            size="sm"
            disabled={newRating === 0 || submitting}
            onClick={handleSubmitStoreReview}
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </Button>
        </div>
      )}

      {storeReviewCount > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border p-4 mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">Store rating</span>
          <StarRating value={storeRating} count={storeReviewCount} />
        </div>
      )}

      {/* Menu Items */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border overflow-hidden mb-4">
        <button
          onClick={handleToggleTheme}
          className="w-full flex items-center justify-between p-4 active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
            <span>Dark Mode</span>
          </div>
          <div
            className={`w-12 h-6 rounded-full transition-colors ${darkMode ? "bg-primary" : "bg-gray-300"} relative`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? "translate-x-7" : "translate-x-1"}`}
            />
          </div>
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-center gap-3 text-red-600 active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
      >
        <LogOut className="h-5 w-5" />
        <span>Log Out</span>
      </button>
    </div>
  );
}
