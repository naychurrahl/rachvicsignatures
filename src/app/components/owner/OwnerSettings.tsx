import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, RefreshCw, ShoppingCart, Plus, Trash2, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { StaffOwnerHeader } from '@/app/components/layout/StaffOwnerHeader';
import { useApp } from '@/app/contexts/AppContext';
import { ApiRequest, baseUrl } from '@/app/contexts/ApiRequest';
import { HeroSlide, SocialLink } from '@/app/data/interFaces';
import { toast } from 'sonner';

const POLICY_SLUGS = ['shipping', 'returns', 'privacy', 'terms'] as const;

const EMPTY_SLIDE_FORM = {
  id: '',
  image: '',
  eyebrow: '',
  heading: '',
  body: '',
  primaryCtaLabel: '',
  primaryCtaHref: '',
  secondaryCtaLabel: '',
  secondaryCtaHref: '',
  sortOrder: 0,
  active: true,
};

export function OwnerSettings() {
  const navigate = useNavigate();
  const { settings, setLoadSettings } = useApp();

  const [general, setGeneral] = useState({
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    location: settings.location,
    currencySymbol: settings.currencySymbol,
    deliveryFee: settings.deliveryFee,
  });
  const [store, setStore] = useState({
    storeOpen: settings.storeOpen,
    openTime: settings.openTime,
    closeTime: settings.closeTime,
    refundEnabled: settings.refundEnabled,
    refundDays: settings.refundDays,
    orderItemLimit: settings.orderItemLimit,
  });
  const [policyDrafts, setPolicyDrafts] = useState(settings.policies);

  const [savingGeneral, setSavingGeneral] = useState(false);
  const [savingStore, setSavingStore] = useState(false);
  const [savingPolicy, setSavingPolicy] = useState<string | null>(null);

  const [showSlideDialog, setShowSlideDialog] = useState(false);
  const [slideForm, setSlideForm] = useState(EMPTY_SLIDE_FORM);
  const [savingSlide, setSavingSlide] = useState(false);

  const [newSocial, setNewSocial] = useState({ platform: 'instagram', url: '' });
  const [savingSocial, setSavingSocial] = useState(false);

  useEffect(() => {
    setGeneral({
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      location: settings.location,
      currencySymbol: settings.currencySymbol,
      deliveryFee: settings.deliveryFee,
    });
    setStore({
      storeOpen: settings.storeOpen,
      openTime: settings.openTime,
      closeTime: settings.closeTime,
      refundEnabled: settings.refundEnabled,
      refundDays: settings.refundDays,
      orderItemLimit: settings.orderItemLimit,
    });
    setPolicyDrafts(settings.policies);
  }, [settings]);

  const refresh = () => setLoadSettings((prev: boolean) => !prev);

  const saveGeneral = async () => {
    setSavingGeneral(true);
    try {
      await ApiRequest({ url: `${baseUrl}/settings`, method: 'PUT', body: general });
      toast.success('General settings saved');
      refresh();
    } catch (error) {
      toast.error(`Failed to save: ${error}`);
    } finally {
      setSavingGeneral(false);
    }
  };

  const saveStore = async () => {
    setSavingStore(true);
    try {
      await ApiRequest({ url: `${baseUrl}/settings`, method: 'PUT', body: store });
      toast.success('Store settings saved');
      refresh();
    } catch (error) {
      toast.error(`Failed to save: ${error}`);
    } finally {
      setSavingStore(false);
    }
  };

  const savePolicy = async (slug: string) => {
    const draft = policyDrafts[slug];
    if (!draft) return;
    setSavingPolicy(slug);
    try {
      await ApiRequest({
        url: `${baseUrl}/policies/${slug}`,
        method: 'PUT',
        body: { title: draft.title, body: draft.body },
      });
      toast.success(`${draft.title} saved`);
      refresh();
    } catch (error) {
      toast.error(`Failed to save: ${error}`);
    } finally {
      setSavingPolicy(null);
    }
  };

  const openCreateSlide = () => {
    setSlideForm(EMPTY_SLIDE_FORM);
    setShowSlideDialog(true);
  };

  const openEditSlide = (slide: HeroSlide) => {
    setSlideForm({
      id: slide.id,
      image: slide.image,
      eyebrow: slide.eyebrow ?? '',
      heading: slide.heading ?? '',
      body: slide.body ?? '',
      primaryCtaLabel: slide.primaryCtaLabel ?? '',
      primaryCtaHref: slide.primaryCtaHref ?? '',
      secondaryCtaLabel: slide.secondaryCtaLabel ?? '',
      secondaryCtaHref: slide.secondaryCtaHref ?? '',
      sortOrder: slide.sortOrder,
      active: slide.active,
    });
    setShowSlideDialog(true);
  };

  const saveSlide = async () => {
    if (!slideForm.image.trim()) {
      toast.error('Image URL is required');
      return;
    }
    setSavingSlide(true);
    try {
      if (slideForm.id) {
        await ApiRequest({ url: `${baseUrl}/hero-slides`, method: 'PUT', body: slideForm });
      } else {
        await ApiRequest({ url: `${baseUrl}/hero-slides`, method: 'POST', body: slideForm });
      }
      toast.success('Hero slide saved');
      setShowSlideDialog(false);
      refresh();
    } catch (error) {
      toast.error(`Failed to save slide: ${error}`);
    } finally {
      setSavingSlide(false);
    }
  };

  const deleteSlide = async (id: string) => {
    try {
      await ApiRequest({ url: `${baseUrl}/hero-slides/${id}`, method: 'DELETE' });
      toast.success('Hero slide removed');
      refresh();
    } catch (error) {
      toast.error(`Failed to remove slide: ${error}`);
    }
  };

  const addSocialLink = async () => {
    if (!newSocial.url.trim()) {
      toast.error('URL is required');
      return;
    }
    setSavingSocial(true);
    try {
      await ApiRequest({
        url: `${baseUrl}/social-links`,
        method: 'POST',
        body: { ...newSocial, sortOrder: settings.socialLinks.length },
      });
      toast.success('Social link added');
      setNewSocial({ platform: 'instagram', url: '' });
      refresh();
    } catch (error) {
      toast.error(`Failed to add link: ${error}`);
    } finally {
      setSavingSocial(false);
    }
  };

  const updateSocialLinkUrl = async (link: SocialLink, url: string) => {
    try {
      await ApiRequest({ url: `${baseUrl}/social-links`, method: 'PUT', body: { id: link.id, url } });
      refresh();
    } catch (error) {
      toast.error(`Failed to update link: ${error}`);
    }
  };

  const deleteSocialLink = async (id: number) => {
    try {
      await ApiRequest({ url: `${baseUrl}/social-links/${id}`, method: 'DELETE' });
      toast.success('Social link removed');
      refresh();
    } catch (error) {
      toast.error(`Failed to remove link: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <StaffOwnerHeader title="Store Settings" onBack={() => navigate('/owner/dashboard')} />

      <div className="p-4">
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="store">Store</TabsTrigger>
            <TabsTrigger value="hero">Hero Slides</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>

          {/* General */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Contact & Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contact-email" className="text-xs text-gray-500">Contact Email</Label>
                  <Input
                    id="contact-email"
                    value={general.contactEmail}
                    onChange={(e: any) => setGeneral({ ...general, contactEmail: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-phone" className="text-xs text-gray-500">Contact Phone</Label>
                  <Input
                    id="contact-phone"
                    value={general.contactPhone}
                    onChange={(e: any) => setGeneral({ ...general, contactPhone: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-xs text-gray-500">Location</Label>
                  <Input
                    id="location"
                    value={general.location}
                    onChange={(e: any) => setGeneral({ ...general, location: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="currency-symbol" className="text-xs text-gray-500">Currency Symbol</Label>
                    <Input
                      id="currency-symbol"
                      value={general.currencySymbol}
                      onChange={(e: any) => setGeneral({ ...general, currencySymbol: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="delivery-fee" className="text-xs text-gray-500">Delivery Fee</Label>
                    <Input
                      id="delivery-fee"
                      type="number"
                      step="0.01"
                      min="0"
                      value={general.deliveryFee}
                      onChange={(e: any) => setGeneral({ ...general, deliveryFee: parseFloat(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button size="sm" onClick={saveGeneral} disabled={savingGeneral}>
                  {savingGeneral ? 'Saving…' : 'Save General Settings'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {settings.socialLinks.map((link) => (
                  <div key={link.id} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-20 shrink-0 capitalize">{link.platform}</span>
                    <Input
                      defaultValue={link.url}
                      onBlur={(e: any) => {
                        if (e.target.value !== link.url) updateSocialLinkUrl(link, e.target.value);
                      }}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon" onClick={() => deleteSocialLink(link.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Select value={newSocial.platform} onValueChange={(v: string) => setNewSocial({ ...newSocial, platform: v })}>
                    <SelectTrigger className="w-32 shrink-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="https://..."
                    value={newSocial.url}
                    onChange={(e: any) => setNewSocial({ ...newSocial, url: e.target.value })}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={addSocialLink} disabled={savingSocial}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Store */}
          <TabsContent value="store" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Store Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="store-open">Store Open</Label>
                  <Switch
                    id="store-open"
                    checked={store.storeOpen}
                    onCheckedChange={(checked: boolean) => setStore({ ...store, storeOpen: checked })}
                  />
                </div>
                {store.storeOpen && (
                  <>
                    <div>
                      <Label htmlFor="open-time" className="text-xs text-gray-500">Opening Time</Label>
                      <Input
                        id="open-time"
                        type="time"
                        value={store.openTime}
                        onChange={(e: any) => setStore({ ...store, openTime: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="close-time" className="text-xs text-gray-500">Closing Time</Label>
                      <Input
                        id="close-time"
                        type="time"
                        value={store.closeTime}
                        onChange={(e: any) => setStore({ ...store, closeTime: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refund Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="refund-enabled">Enable Refunds</Label>
                  <Switch
                    id="refund-enabled"
                    checked={store.refundEnabled}
                    onCheckedChange={(checked: boolean) => setStore({ ...store, refundEnabled: checked })}
                  />
                </div>
                {store.refundEnabled && (
                  <div>
                    <Label htmlFor="refund-days" className="text-xs text-gray-500">Refund Window (days)</Label>
                    <Input
                      id="refund-days"
                      type="number"
                      value={store.refundDays}
                      onChange={(e: any) => setStore({ ...store, refundDays: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                      min="1"
                      max="90"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Order Limits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="order-limit" className="text-xs text-gray-500">Maximum Items Per Order</Label>
                  <Input
                    id="order-limit"
                    type="number"
                    value={store.orderItemLimit}
                    onChange={(e: any) => setStore({ ...store, orderItemLimit: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Set to 0 for unlimited</p>
                </div>
              </CardContent>
            </Card>

            <Button size="sm" onClick={saveStore} disabled={savingStore}>
              {savingStore ? 'Saving…' : 'Save Store Settings'}
            </Button>
          </TabsContent>

          {/* Hero Slides */}
          <TabsContent value="hero" className="space-y-3">
            <Button size="sm" onClick={openCreateSlide}>
              <Plus className="h-4 w-4 mr-2" />
              Add Slide
            </Button>
            {settings.heroSlides
              .slice()
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((slide) => (
                <Card key={slide.id}>
                  <CardContent className="p-4 flex items-center gap-3">
                    {slide.image ? (
                      <img src={slide.image} alt="" className="w-16 h-16 rounded object-cover shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded bg-gray-200 dark:bg-gray-800 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{slide.heading || '(no heading)'}</p>
                      <p className="text-xs text-gray-500">
                        {slide.active ? 'Active' : 'Inactive'} · order {slide.sortOrder}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => openEditSlide(slide)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteSlide(slide.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          {/* Policies */}
          <TabsContent value="policies" className="space-y-4">
            {POLICY_SLUGS.map((slug) => {
              const draft = policyDrafts[slug];
              if (!draft) return null;
              return (
                <Card key={slug}>
                  <CardHeader>
                    <CardTitle className="text-sm">{draft.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500">Title</Label>
                      <Input
                        value={draft.title}
                        onChange={(e: any) =>
                          setPolicyDrafts({ ...policyDrafts, [slug]: { ...draft, title: e.target.value } })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Body (blank line separates paragraphs)</Label>
                      <Textarea
                        value={draft.body}
                        onChange={(e: any) =>
                          setPolicyDrafts({ ...policyDrafts, [slug]: { ...draft, body: e.target.value } })
                        }
                        className="mt-1 min-h-[160px]"
                      />
                    </div>
                    <Button size="sm" onClick={() => savePolicy(slug)} disabled={savingPolicy === slug}>
                      {savingPolicy === slug ? 'Saving…' : 'Save'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showSlideDialog} onOpenChange={setShowSlideDialog}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{slideForm.id ? 'Edit Hero Slide' : 'Add Hero Slide'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-gray-500">Image URL</Label>
              <Input
                value={slideForm.image}
                onChange={(e: any) => setSlideForm({ ...slideForm, image: e.target.value })}
                placeholder="https://..."
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Eyebrow</Label>
              <Input
                value={slideForm.eyebrow}
                onChange={(e: any) => setSlideForm({ ...slideForm, eyebrow: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Heading</Label>
              <Input
                value={slideForm.heading}
                onChange={(e: any) => setSlideForm({ ...slideForm, heading: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Body</Label>
              <Textarea
                value={slideForm.body}
                onChange={(e: any) => setSlideForm({ ...slideForm, body: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <Label className="text-xs text-gray-500">Primary CTA Label</Label>
                <Input
                  value={slideForm.primaryCtaLabel}
                  onChange={(e: any) => setSlideForm({ ...slideForm, primaryCtaLabel: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs text-gray-500">Primary CTA Link</Label>
                <Input
                  value={slideForm.primaryCtaHref}
                  onChange={(e: any) => setSlideForm({ ...slideForm, primaryCtaHref: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <Label className="text-xs text-gray-500">Secondary CTA Label</Label>
                <Input
                  value={slideForm.secondaryCtaLabel}
                  onChange={(e: any) => setSlideForm({ ...slideForm, secondaryCtaLabel: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs text-gray-500">Secondary CTA Link</Label>
                <Input
                  value={slideForm.secondaryCtaHref}
                  onChange={(e: any) => setSlideForm({ ...slideForm, secondaryCtaHref: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <Label className="text-xs text-gray-500">Sort Order</Label>
                <Input
                  type="number"
                  value={slideForm.sortOrder}
                  onChange={(e: any) => setSlideForm({ ...slideForm, sortOrder: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
              <div className="flex-1 flex items-center justify-between pt-5">
                <Label htmlFor="slide-active">Active</Label>
                <Switch
                  id="slide-active"
                  checked={slideForm.active}
                  onCheckedChange={(checked: boolean) => setSlideForm({ ...slideForm, active: checked })}
                />
              </div>
            </div>
            <Button onClick={saveSlide} disabled={savingSlide} className="w-full">
              {savingSlide ? 'Saving…' : 'Save Slide'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
