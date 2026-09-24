# Go Live Checklist — Visualet Designs (v9.3.13)

Do these in order. Nothing here changes how the site looks — it's all setup.

## Step 1 — Connect the backend so orders reach you (~10 min) [REQUIRED]

Right now an order placed on the site is saved only in the *customer's* browser —
you would never see it. This step fixes that.

1. Go to **script.google.com** and sign in with your Google account.
2. Click **New project**.
3. Delete everything in the default `Code.gs` file, then paste in the entire
   contents of **`WebsiteBackend.gs`** (included in this zip).
4. At the top of the script there's a `SPREADSHEET_ID` setting. **Already done for you in v9.3.12+:** your CRM spreadsheet ID ships pre-configured —
   on the first order a `WebsiteOrders` tab is added to your CRM sheet automatically.
5. Click **Deploy → New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**, then **Authorize access** when Google asks.
6. Copy the web app URL (it ends in `/exec`).
7. **Already done for you in v9.3.10+:** your web-app URL ships pre-configured in the site, so every customer order reaches your Google Sheet automatically. (You can still override it in gear icon → Settings → "Google Apps Script web-app URL".)
8. Test it: place a test order from your phone (use a fake name), then check
   **Admin → Orders** on your computer — the order should be there.

What this unlocks: orders + artwork uploads go to your Google Sheet/Drive,
order tracking works from any device, and you get the artwork files automatically.

## Step 2 — Change the admin PIN [REQUIRED]

Gear icon → PIN `visualet` → **Settings** → change the PIN. Anyone who has ever
seen the default could open your dashboard.

## Step 3 — Confirm payments (2 min)

Gear icon → **Settings → Online Payments**:
- **Square** — your payment link is already filled in. Open it once to make sure
  it still works and lets the customer enter a custom amount.
- **Zelle** — `951-806-1586` is prefilled. Confirm it's the right number.
- **Cash App** — blank right now, so the Cash App button is hidden at checkout.
  Add your `$cashtag` if you want it, or leave it hidden.

## Step 4 — Upload the site (5 min)

Upload to your website root, replacing the old files (**back up the old
`index.html` first**):
- `index.html`
- `logo.png`
- the `images/` folder (all 16 photos)
- `possibleheadshot.jpg` — only if you have an About photo; the site shows a
  "VD" monogram without it.

Then hard-refresh (Ctrl/Cmd+Shift+R) or open a private window so you see the new
version, not a cached one.

## Step 5 — Test like a customer (5 min)

On your phone:
1. Open a Business Cards product → upload a front and back image → the
   **"Print-Ready Reward Unlocked! −$20"** popup should animate in, and the price
   should drop by $20.
2. Add to cart → Checkout → fill details → pick a payment method → place order.
3. Use the **Track Order** page with your order number — the status timeline
   should appear.

## Good to know (admin panel limits)

- **Product edits** (prices, photos, new products) you make in the admin panel are
  saved in **that browser only** — they don't sync to your other devices and they
  don't change what visitors see unless the file itself is updated. To make a
  product change permanent for everyone: update it in `index.html` (ask me and
  I'll do it) and re-upload the file.
- **Download Backup** (Admin → Settings) regularly — it exports your products,
  orders, and settings as a JSON file. If you ever clear browser data, import it
  back.
- The `$20 print-ready reward` applies per business-card item when the customer
  uploads both front and back artwork. Removing either file removes the discount.

## What's new in v9.3

- Product popup: the bottom bar (Total + Add to Cart) no longer overlaps the
  photos, thumbnails, or "attached" badges — content scrolls cleanly above it.
- The $20 reward popup now animates above the product popup (it was hidden
  behind it before).
- Artwork section reworded: "Have your own print-ready artwork? No artwork?
  No problem — every package includes a custom design."
- Removed the small off-center logo from the checkout header.
- Roofing Marketing Bundle image now shows fully instead of cropped.
- Mobile + desktop alignment pass.
