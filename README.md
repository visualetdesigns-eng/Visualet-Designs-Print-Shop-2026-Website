# Visualet Designs — Online Print Shop Website (v4)

Updated: 2026-09-23. Single-file website (`index.html`) + images folder + `logo.png` + optional Google Sheets backend.

## What's new in v4

- **Phone CTA** — "Text us: **951-806-1586**" is now a contact card in the **Contact** section (tap-to-text via `sms:` link) *and* in the footer.
- **Customize buttons** — every product card in Print Products has a prominent gradient **Customize** button that opens the product configurator (the Custom Canopy card included).
- **iPhone mockup band** — new "Order Right From Your Phone" section after How It Works: a pure-CSS Dynamic Island-style iPhone showing a mini shop UI (no external assets, lightweight).
- **Real logo wired in** — the trimmed `logo.png` (848×369, no padding) is now **bundled in the zip** and shown in the nav (46px), footer (44px), checkout header, and as the site favicon/app icon. No more missing-image box.
- **Checkout header branding** — the checkout modal now shows the Visualet logo above the step dots.

## What's new in v2/v3 (still in v4)

- **Payments at checkout** — 4-step checkout: Details → **Artwork & Payment** → Review → Done. Customers choose **Square (card online)**, **Zelle**, **Cash App**, or **Pay later / proof-first**. Payment happens *after* the order is placed so the order # can go in the payment memo/note. Orders show an **"Awaiting payment"** badge until you mark them **Paid** in the admin Orders tab. Square is pre-configured with Nathan's live payment link and opens in a centered popup window (new-tab fallback).
- **Zelle details** — Zelle account name shown as **Nathan Salamanca**; number **951-806-1586** with tap-to-copy at checkout *and* listed in the "How It Works" section. Zelle payers are told to text `"ZELLE#<order#>"` plus their payment screenshot to 951-806-1586.
- **Artwork upload at checkout** — customers can attach up to 10 print-ready files (PDF, AI, EPS, PNG, JPG, TIFF, SVG — 25MB each). With the backend connected, files go straight to a Drive folder `Visualet Website Artwork/<order#>/` and link from the order. Without it, the customer is asked to email art referencing their order #.
- **Photo lightbox** — click any product photo for a fullscreen viewer: zoom (buttons, wheel, pinch), swipe/arrow-key gallery navigation, Esc to close.
- **Multiple photos per product** — products carry an `images[]` gallery (first = cover). Cards show thumbnail dots (click a dot to swap); the admin product editor supports upload, URL add, reorder, cover pick, and remove.
- **Editable hero covers** — Admin → Settings → **"Homepage Cover Photos"**: 3 upload slots with live preview, editable captions, and reset-to-defaults. They feed the hero 3D carousel.
- **3D** — hero is a slow auto-rotating 3D carousel of the 3 covers (pauses on hover/touch, static row for reduced-motion); product cards have pointer-based 3D tilt on desktop hover (fast-tracked, ±12°, smooth ease-back); subtle scroll parallax on the hero.

## What's included

| File | What it is |
|---|---|
| `index.html` | The entire website — shop, cart, checkout, order tracking, admin panel |
| `logo.png` | Trimmed Visualet logo (848×369) — **included**, used in nav/footer/checkout/favicon |
| `images/` | 16 compressed product photos from Instagram (2.9 MB total) |
| `WebsiteBackend.gs` | Optional Apps Script connector → writes website orders into a Google Sheet, receives artwork uploads |
| `possibleheadshot.jpg` | **You provide** — copy from your current site root (About photo) |

## Install (5 minutes)

1. **Delete your old local test folder completely** (the 127.0.0.1 copy is stale — that's why nothing looked changed).
2. Download the **fresh zip** and extract it.
3. Upload `index.html`, `logo.png`, and the `images/` folder to your website root (replacing old files — **back up the old index.html first**).
4. Copy your existing `possibleheadshot.jpg` next to `index.html` (About photo).
5. Hard-refresh (Ctrl/Cmd+Shift+R) or open in a private window, then test on phone + desktop.

## Testing checklist (v4)

- **Payment screen:** add any product to cart → cart drawer → **Checkout** → fill Details → **"Artwork & Payment →"** → you should see the upload dropzone + **Pay by Card — Square / Zelle / Cash App / Pay later — proof first** cards. Pick Zelle to see the Nathan Salamanca instructions + tap-to-copy number.
- **Square popup:** choose Square → Review → **Place Order** → confirmation shows **"Pay $X.XX with Square"** → click it → a centered Square window opens ("Check Out Via Square!").
- **Lightbox:** click any product photo (not a dot) → fullscreen viewer with zoom buttons, arrows, Esc.
- **Multi-photo:** cards with more than one photo show dots under the image; click dots to swap.
- **Cover photos:** gear icon (top-right) → PIN `visualet` → **Settings** → scroll to **"Homepage Cover Photos"** → upload 3 photos, change captions, or Reset to defaults.
- **Tilt:** hover a product card on desktop — it should follow your cursor in 3D.
- **Customize button:** every Print Products card shows a gradient **Customize** button.
- **Phone CTA:** Contact section has a "Text Us / 951-806-1586" card; footer shows "Text us: 951-806-1586".

## Setting up payments

Admin panel (gear icon → PIN) → **Settings** → **Online Payments**:

1. **Square** — paste your Square **Payment Link**. Create it in your Square Dashboard → Payment Links, and set the link to let the *customer enter the amount*. The Square option only appears at checkout when a link is set; after ordering, the customer clicks through and is told to enter the exact order total (shown big on screen) as the amount.
2. **Cash App** — enter your `$cashtag`. The option appears only when set.
3. **Zelle** — number is prefilled as **951-806-1586** (your public business number); change it anytime here.
4. Toggle **"Accept online payments at checkout"** off to run proof-first only.

How it works: the customer picks a payment method at checkout, places the order, then pays on the confirmation screen (Square button, Zelle/Cash App number with tap-to-copy + memo instructions). Orders land in your admin **Orders** tab with an **"Awaiting payment"** badge — hit **Mark paid** when the money arrives. No card details ever touch your site; Square handles cards on their page.

## The admin panel (your private control room)

1. Click the **gear icon** (top-right of the nav).
2. Default PIN: `visualet` — **change it immediately** in Settings (it shows you the current PIN there).
3. **Products tab**: Add / Edit / Hide / Delete products. The form takes:
   - Name, category, badge (e.g. "Sale"), turnaround
   - **Photos**: upload from your phone/computer (auto-compressed) or paste image URLs — add several, reorder with ← →, set the cover with ★, remove with ✕
   - Quantities & prices, one per line: `250 cards : 75`
   - Options, one per line: `Finish: High Gloss UV, Matte`
   - "What's included" bullet list
   - Changes go live instantly.
4. **Orders tab**: every order placed on *that device/browser*, with a status dropdown — Received → In Design → In Production → Shipped → Delivered — plus payment badge, **Mark paid** button, and artwork file links. Customers see the status on the Track page.
5. **Settings tab**: backend URL, online payments, homepage cover photos, PIN change, **Download Backup** (do this regularly — data lives in the browser).

## How ordering works (for customers)

Shop → Configure (quantity rungs, options like finish) → Add to cart → Checkout: **1)** contact + shipping, **2)** artwork upload + payment method, **3)** review → Place Order → confirmation with order number (e.g. `VD-8K2P4Q`) + payment instructions → Track Order page shows a live status timeline.

## Order tracking + artwork — important

- **Without the backend script:** orders are stored in the customer's own browser. Tracking works on the same device/browser they ordered from; artwork files are *not* transferred — the customer is told to email them. Your admin Orders tab shows orders placed on *your* device only.
- **With the backend script** (`WebsiteBackend.gs` deployed as a web app, URL pasted in admin Settings): orders are written to a `WebsiteOrders` sheet (now with **Payment** and **Artwork** columns — added automatically to older sheets), artwork uploads land in Drive under `Visualet Website Artwork/<order#>/`, and tracking works from any device. This is the recommended setup — it takes ~10 minutes.

To connect: script.google.com → new project → paste `WebsiteBackend.gs` → Deploy → New deployment → Web app → Execute as: Me → Who has access: **Anyone** → copy the `/exec` URL → paste in admin Settings. Optionally set `SPREADSHEET_ID` at the top of the script to your CRM spreadsheet so website orders land next to your other orders.

**Limits to know:** the PIN gate and all product/order data live in the browser (localStorage) — this is convenience-level, not bank-grade security, and edits on one device don't sync to others. Uploaded product photos are compressed but many large photos can fill browser storage — keep them small. For a multi-device, multi-user store with real accounts, the next upgrade is a proper backend/database.

## Product catalog (from your Instagram, Sept 2026)

Business Cards Standard (250/$75 → 2,500/$160) • Rounded Business Cards (250/$95 → 2,500/$195) • Door Hangers (750/$150, 1,000/$180) • 10'×10' Event Canopy ($600, was $750) • 24"×36" A-Frame Signs ($225) • 6FT Table Cover ($160) • Retractable Banner ($175) • Vinyl Banner Duo ($95) • Yard Signs ($85) • Vehicle Magnets ($85) • Roofing Bundle ($585) • Logo packages (Silver $50 / Gold $75 / Diamond $200).

Prices came from your Instagram captions — confirm they're current before you announce the site. Vehicle magnet pricing ($85) appeared only in a post image overlay, so double-check that one.

## Notes

- The product photos are your Instagram ad mockups (compressed for fast loading). Swap in real press photos anytime via the admin panel.
- Flyers aren't sold standalone yet (they only appear in the Roofing Bundle) — add them as a product whenever you set standalone pricing.
- The site is fully mobile-friendly, respects reduced-motion settings, and uses no external libraries (fast load, nothing to break).
- GitHub hosting: this is a static site — push `index.html` + `images/` (+ `logo.png`, `possibleheadshot.jpg`) to your repo and **every change goes live on your next push/deploy automatically**. Product edits you make in the admin panel live in *your browser only*; to make them permanent for all visitors, export the backup JSON and/or update the `DEFAULT_PRODUCTS` in `index.html` before pushing.
