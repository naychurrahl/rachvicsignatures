import { useEffect, useState } from 'react';
import { User, LayoutDashboard, LogOut, Moon, Sun, KeyRound, Pencil } from 'lucide-react';
import { useApp } from '@/app/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { ApiRequest, baseUrl, setAuthToken } from '@/app/contexts/ApiRequest';
import { StarRating } from '@/app/components/layout/StarRating';
import { Textarea } from '@/app/components/ui/textarea';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/app/components/ui/alert-dialog';
import { toast } from 'sonner';
import { ReviewsResponse } from '@/app/data/interFaces';

export function Profile() {
  const { logout, user, setUser, orders } = useApp();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const darkMode = theme === 'dark';

  const [storeRating, setStoreRating] = useState(0);
  const [storeReviewCount, setStoreReviewCount] = useState(0);
  const [alreadyReviewedStore, setAlreadyReviewedStore] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [savingName, setSavingName] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

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

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingName(true);
    try {
      const res = await ApiRequest({
        url: `${baseUrl}/user`,
        method: 'PUT',
        body: { id: user?.userId, name },
      });
      if (res.token) setAuthToken(res.token);
      setUser(user ? { ...user, name: res.name ?? name } : user);
      setEditingName(false);
      toast.success('Profile updated');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update profile');
    } finally {
      setSavingName(false);
    }
  };

  const handleDeactivate = async () => {
    setDeactivating(true);
    try {
      await ApiRequest({ url: `${baseUrl}/user`, method: 'DELETE', body: { id: user?.userId } });
      await logout();
      navigate('/');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to deactivate account');
      setDeactivating(false);
    }
  };

  const handleToggleTheme = async () => {
    const next = darkMode ? 'light' : 'dark';
    setTheme(next);
    try {
      const res = await ApiRequest({
        url: `${baseUrl}/user`,
        method: 'PUT',
        body: { id: user?.userId, theme: next },
      });
      if (res.token) setAuthToken(res.token);
    } catch (error) {
      console.error('Failed to save theme preference', error);
    }
  };

  if (!user) return null;

  const cmsUrl =
    import.meta.env.VITE_CMS_URL || "https://rachvic-cpanel.vercel.app";

  const backofficeLinks =
    user.role === 'admin' || user.role === 'staff'
      ? [{ label: 'Store Dashboard', href: cmsUrl }]
      : [];

  return (
    <div className="p-4 pb-20">
      {/* User Info */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="h-8 w-8 text-primary" />
          </div>
          {editingName ? (
            <form onSubmit={handleSaveName} className="flex-1 flex items-center gap-2">
              <Input
                value={name}
                onChange={(e: any) => setName(e.target.value)}
                className="h-9"
                autoFocus
                required
              />
              <Button type="submit" size="sm" disabled={savingName}>
                {savingName ? '...' : 'Save'}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setName(user.name ?? '');
                  setEditingName(false);
                }}
              >
                Cancel
              </Button>
            </form>
          ) : (
            <div className="flex-1 flex items-center justify-between">
              <div>
                <h2 className="text-lg">{user.name || user.email}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={() => setEditingName(true)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Edit name"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {backofficeLinks.length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          {backofficeLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-center gap-3 active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
            >
              <LayoutDashboard className="h-5 w-5 text-primary" />
              <span>{link.label}</span>
            </a>
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

      <div className="bg-white dark:bg-gray-900 rounded-lg border overflow-hidden mb-4">
        <button
          onClick={() => navigate('/change-password')}
          className="w-full flex items-center gap-3 p-4 active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
        >
          <KeyRound className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <span>Change Password</span>
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-center gap-3 mb-4 text-red-600 active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
      >
        <LogOut className="h-5 w-5" />
        <span>Log Out</span>
      </button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-center gap-3 text-red-600 active:bg-gray-50 dark:active:bg-gray-800 transition-colors">
            <span>Deactivate Account</span>
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate your account?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll be signed out and won't be able to place orders until an admin
              reactivates your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={deactivating} onClick={handleDeactivate}>
              {deactivating ? 'Deactivating...' : 'Deactivate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
