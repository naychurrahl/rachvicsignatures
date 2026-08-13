# Rachvic Signatures -- Storefront

The customer-facing storefront for Rachvic Signatures: product browsing and
search, cart, checkout (Paystack), order history, product/store reviews, and
live support chat. This is a customer-only app -- the owner/staff back office
lives in a separate app, [`rachvic/cms`](../cms).

## Stack

React 18 + TypeScript, Vite 6, Tailwind CSS 4, shadcn/Radix UI primitives,
React Router 7. No server-side rendering -- this is a plain SPA served as
static files.

## Running locally

```bash
npm install
npm run dev
```

Starts the Vite dev server on `http://localhost:5173`. `npm run build`
produces a static `dist/` bundle; there's no separate typecheck step (this
project has no `tsconfig.json`), so `vite build`'s esbuild pass is the only
build-time signal.

## Configuration

Copy `.env.example` to `.env` and adjust as needed:

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the [`rachvic/backend`](../backend) API. Defaults to `https://rachvicsignature.com`. |
| `VITE_CMS_URL` | Where the owner/staff back office is deployed. Used only for the "Back office" links surfaced to staff/admin accounts on the Profile page. |

The backend already allows any `localhost`/`127.0.0.1` origin regardless of
port, so no backend-side CORS change is needed for local dev.

## Structure

```
src/app/
  components/
    customer/   Route-level pages (Home, ProductDetails, Cart, Checkout, Orders, Profile, ...)
    layout/     Storefront sections composed into Home (Hero, PromoBanner, ProductRail, SiteHeader, SiteFooter, ...)
    chat/       Customer-facing support chat widget
    modal/      Auth modal (login/register/forgot-password)
    ui/         shadcn primitives
  contexts/     AppContext (global state: user, cart, products, settings, content) + ApiRequest (fetch wrapper)
  data/         TypeScript interfaces + DEFAULT_SETTINGS/DEFAULT_CONTENT fallbacks (shown before the API responds)
  lib/          Small pure helpers (formatCurrency, productLimits)
```

`AppContext` is the single source of truth for server data. Most of it
follows a `loadX`/`setLoadX` boolean-toggle convention: flipping the setter
re-runs the corresponding fetch effect, so components trigger a refresh by
calling e.g. `setLoadProduct(prev => !prev)` rather than re-fetching directly.

## Editable content

Site branding, hours, policies, hero slides, social links, and homepage
marketing copy (promo banners, why-choose-us, section headings, etc.) are all
owner-editable from `rachvic/cms` and fetched here read-only via `GET
/settings` and `GET /content`. `defaultSettings.ts`/`defaultContent.ts` exist
purely as pre-fetch fallbacks so the page never flashes blank/broken copy --
they are not the source of truth.

## API reference

See [`../backend/doc.openai.yaml`](../backend/doc.openai.yaml) for the full
OpenAPI spec of every endpoint this app calls.
