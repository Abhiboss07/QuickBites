# 🍔 QuickBites — Master AI Prompts Guide
## Step-by-Step Build Prompts for Claude, Gemini & Opus

---

## 📁 Project Structure
```
quickbites/
├── index.html              ← Hub landing page (✅ Done)
├── customer/
│   ├── index.html          ← Customer app home (✅ Done)
│   ├── order-tracking.html ← Live order tracking (✅ Done)
│   ├── restaurant.html     ← Restaurant menu page (→ Next)
│   └── profile.html        ← User profile & orders
├── admin/
│   └── index.html          ← Full admin panel (✅ Done)
├── rider/
│   └── index.html          ← Rider panel (✅ Done)
└── shared/
    └── styles.css          ← Shared design tokens
```

---

## 🎨 DESIGN SYSTEM (Include in every prompt)

```
DESIGN SYSTEM — always reference this:

Colors:
  --primary: #FF6B35    (Cartoon Orange)
  --secondary: #FFD23F  (Sunny Yellow)
  --accent: #06D6A0     (Minty Green)
  --purple: #9B5DE5     (Lavender)
  --pink: #F72585       (Hot Pink)
  --dark: #1a1a2e       (Deep Navy)

Fonts:
  Display: 'Fredoka One' (all headings, logos, numbers)
  Body: 'Nunito' 700/800/900 weight

Background:
  CSS gradient: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)
  + 3 animated blur blobs (rgba colored circles, filter:blur(80px))

Glassmorphism Cards:
  background: rgba(255,255,255,0.08)
  backdrop-filter: blur(20px)
  border: 1px solid rgba(255,255,255,0.2)
  border-radius: 24px

Animations:
  - Cards: hover translateY(-8px) + box-shadow glow
  - Buttons: hover translateY(-2px) + stronger shadow
  - Floating food emojis: keyframe floatUp (bottom to top, rotate)
  - Background blobs: blobFloat (up-down, scale)
  - Status indicators: pulse/blink animations
```

---

## 🔢 STEP-BY-STEP BUILD PROMPTS

---

### STEP 1 — Restaurant Menu Page
**Best Model: Claude Sonnet** (complex UI, many interactive states)

```
Build a restaurant menu page for QuickBites food delivery app.

DESIGN SYSTEM: [paste design system above]

PAGE: customer/restaurant.html

SECTIONS TO BUILD:
1. Sticky header with restaurant name, back button, cart count badge
2. Hero banner (restaurant emoji + name + rating + cuisine tags + delivery info)
3. Sticky category nav pills (Starters, Main Course, Desserts, Drinks) that 
   highlight active section on scroll
4. Menu items grid — each card has:
   - Food emoji (large, in gradient colored box)
   - Dish name (Fredoka One font)
   - Description (2 lines, muted color)
   - Veg/Non-veg badge (green/red dot with border)
   - Price (bold yellow)
   - Add to cart button (animates to show quantity +/- when clicked)
   - Popular badge on some items
5. Sticky bottom cart bar (shows when items in cart): 
   "3 items | ₹648 | View Cart →" with slide-up animation
6. Cart sidebar (slide in from right, same as index.html)

INTERACTIONS:
- Add item → button morphs into qty controller (+/-)
- Cart count in header updates live
- Bottom bar slides up when first item added
- Smooth scroll to section when category pill clicked
- Category pill auto-highlights on scroll (IntersectionObserver)

RESTAURANT DATA (use Pizza Palace):
Items: Margherita (₹299), BBQ Chicken (₹399), Pasta Alfredo (₹249),
Garlic Bread (₹99), Tiramisu (₹189), Cold Coffee (₹129)

Follow exact design system. Pure HTML/CSS/JS. No frameworks.
```

---

### STEP 2 — User Profile & Order History
**Best Model: Claude Sonnet** (moderate complexity)

```
Build a user profile page for QuickBites food delivery app.

DESIGN SYSTEM: [paste design system above]

PAGE: customer/profile.html

SECTIONS:
1. Profile header card:
   - Large avatar circle with emoji (user-selectable from 6 options)
   - Name, phone, joined date
   - Stats row: Total Orders, Total Spent, Avg Rating Given

2. Tabs: My Orders | Saved Addresses | Payment Methods | Settings

3. "My Orders" tab:
   - Filter chips: All / Active / Past / Cancelled
   - Order cards with: restaurant emoji, name, date, items summary,
     total amount, status chip (color-coded), "Reorder" and "Rate" buttons
   - Active orders show live progress bar

4. "Saved Addresses" tab:
   - Address cards with: Home 🏠 / Work 🏢 / Other 📍 labels
   - Edit/Delete buttons
   - "Add New Address" button with animated form

5. "Payment Methods" tab:
   - Saved cards (masked: **** 4242)
   - UPI IDs
   - QuickBites wallet balance (with add money)

6. "Settings" tab: toggles for notifications, location, theme

Use cartoon glassmorphism. Animate tab transitions with slide/fade.
```

---

### STEP 3 — Admin: Restaurant Detail Modal
**Best Model: Claude Sonnet** (data-heavy UI)

```
Add a restaurant detail modal/drawer to the existing admin panel 
(admin/index.html).

When user clicks any restaurant card, slide in a right-side drawer (400px)
with full glassmorphism styling.

DRAWER CONTENTS:
1. Restaurant header (emoji, name, cuisine, toggle online/offline)
2. Today's stats: Orders, Revenue, Avg Rating, Avg Delivery Time
3. Mini CSS bar chart showing hourly orders (8am-10pm)
4. Top dishes list (name + orders count + revenue)
5. Recent reviews (customer name, stars, comment, date)
6. Action buttons: Edit Details | View Menu | Send Notification | Suspend

ANIMATIONS:
- Drawer slides in from right (transform translateX)
- Stats count up from 0 on open
- Chart bars animate height on open

Style: same dark glassmorphism as existing admin panel.
```

---

### STEP 4 — Real-time Notifications System
**Best Model: Gemini 2.0 Flash** (speed-focused, streaming UI)

```
Build a notifications overlay system for QuickBites.

This is a shared component (shared/notifications.js) that works 
across all three panels (customer, admin, rider).

FEATURES:
1. Bell icon in top nav with red badge counter
2. Dropdown notification panel (glassmorphism, 380px wide):
   - Title "Notifications 🔔"
   - Filter tabs: All | Orders | Promos | System
   - Notification items with: icon emoji, title, subtitle, time, unread dot
   - Mark all as read button
   - "Load more" with smooth expansion

3. Toast notifications (bottom-right, auto-dismiss 4s):
   - Success (green gradient): "✅ Order delivered!"
   - Warning (orange): "⚠️ Order delayed by 5 min"
   - Error (red): "❌ Payment failed"
   - Info (blue): "ℹ️ New promo code available"
   - Each toast has progress bar that shrinks as it auto-dismisses
   - Stack multiple toasts vertically with smooth push animation

4. Push notification simulation:
   - Every 30s randomly show a demo notification
   - Types: new order (admin/rider), order update (customer)

Use CSS only for animations. Export as ES module for reuse.
```

---

### STEP 5 — Live Map Component
**Best Model: Claude Opus 4** (complex, detailed interactive component)

```
Build an advanced animated map component for QuickBites order tracking.
This replaces the simple CSS map in customer/order-tracking.html.

FILE: shared/cartoon-map.js (self-contained Web Component)

VISUAL DESIGN:
- Dark blue-green map background (#0d2137 base)
- Subtle grid lines for streets (rgba white, 0.06 opacity)
- "Roads" drawn as rounded rectangles with slight opacity
- Building blocks as small rounded squares (darker fill)

MARKERS:
- Restaurant: animated emoji in circular glassmorphism bubble,
  bounces gently, glows orange
- Customer home: house emoji, pulses green glow
- Rider: scooter emoji, actually moves along route path,
  rotates to face direction of movement

ROUTE:
- SVG dashed path between restaurant → rider → customer
- Animated stroke-dashoffset to show "traveling" effect
- Path color: orange (#FF6B35) for completed, teal for remaining

FEATURES:
- Route animation plays on load
- Rider marker animates along path (CSS animation steps)
- ETA badge that counts down in real time
- "Live" pulsing indicator in corner
- Zoom in/out buttons (scale transform)

Usage: <cartoon-map pickup="lat,lng" dropoff="lat,lng" rider="lat,lng">
```

---

### STEP 6 — Admin Analytics Deep Dive
**Best Model: Claude Sonnet** (data viz heavy)

```
Build an advanced analytics page for the QuickBites admin panel.
This is a new page: admin/analytics.html (linked from sidebar).

SECTIONS:

1. KPI Overview (6 animated stat cards, count-up on load)

2. Revenue Chart (interactive):
   - Toggle: Daily / Weekly / Monthly / Yearly
   - Line chart using Canvas API (no libraries)
   - Gradient fill under line
   - Hover tooltip showing exact value
   - Two lines: Revenue vs Target

3. Orders Heatmap:
   - 7×24 grid (days × hours)
   - Cell color intensity = order volume
   - Tooltip on hover
   - Peak hours highlighted with glow

4. Top Performing:
   - Restaurants leaderboard (animated rank changes)
   - Riders leaderboard (with live status dots)
   - Dishes leaderboard (with category color coding)

5. Customer Funnel:
   - CSS funnel chart: Visits → Added to Cart → Checkout → Ordered
   - Animated fill percentages

6. Geographic Distribution:
   - India SVG map (simplified)
   - City dots sized by order volume
   - Pulse animation on top cities

Style: same glassmorphism dark theme. Fredoka One for all numbers.
All charts are pure Canvas or SVG — no Chart.js.
```

---

### STEP 7 — Rider Earnings Advanced
**Best Model: Claude Sonnet**

```
Enhance the rider earnings in rider/index.html with:

1. Monthly earnings calendar:
   - Grid of 30 days
   - Each day cell colored by earnings amount (gradient: dark=low, bright=high)
   - Click day to see that day's deliveries in a modal
   - Today highlighted with ring border

2. Earnings goal tracker:
   - Set daily/weekly goal (editable inline)
   - Progress ring (SVG circle stroke animation)
   - "₹847 / ₹1000 goal" with motivational message
   - Confetti animation when goal is hit

3. Peak hours indicator:
   - 24-hour circular clock face
   - Colored arcs showing high-demand periods
   - "Best times to ride" recommendation

4. Incentive progress:
   - "Complete 20 deliveries today for ₹200 bonus!"
   - Progress bar with milestone markers
   - Reward badges earned this week

Keep same glassmorphism green (#06D6A0) theme from rider panel.
```

---

### STEP 8 — Payment & Checkout Flow
**Best Model: Claude Sonnet**

```
Build a checkout flow page: customer/checkout.html

STEPS (multi-step with animated transitions):

Step 1 — Confirm Order:
- Order items list (editable quantities)
- Special instructions textarea
- Estimated time display

Step 2 — Delivery Address:
- Saved addresses with radio select
- "Add new" with inline form (animated slide down)
- Map preview of selected address (CSS cartoon map)

Step 3 — Payment:
- Payment method selector (glassmorphism cards):
  UPI / Card / Cash / QuickBites Wallet
- UPI: show QR code simulation + UPI ID input
- Card: animated card flip showing front/back,
  input fields that fill the card preview in real-time
- Wallet: balance display, top-up option

Step 4 — Confirmation:
- Animated success (bouncing checkmark)
- Order ID generated
- Confetti burst animation (pure CSS)
- Estimated delivery countdown
- "Track Order" button → order-tracking.html

STEP TRANSITIONS:
- Cards slide left (exit) and slide right (enter)
- Progress bar at top fills step by step
- Back button slides reverse direction

Style: full cartoon glassmorphism. Fredoka One for all headings.
```

---

## 🤖 WHICH MODEL FOR WHAT?

| Task | Best Model | Why |
|------|-----------|-----|
| Complex interactive UI (maps, charts) | **Claude Opus 4** | Longest context, best at multi-component reasoning |
| Standard pages (menus, profiles, forms) | **Claude Sonnet 4.6** | Best speed/quality balance for UI |
| Simple additions (badges, chips, toggles) | **Gemini 2.0 Flash** | Fast iteration, good for small components |
| Animations & micro-interactions | **Claude Sonnet 4.6** | Best CSS animation understanding |
| Data tables & admin UI | **Claude Sonnet 4.6** | Great at structured data display |
| Creative cartoon characters/illustrations | **Gemini 2.0 Flash** | Strong SVG illustration generation |
| Backend/API design (future) | **Claude Opus 4** | Best system design reasoning |

---

## 💡 UNIVERSAL TIPS FOR ALL PROMPTS

1. **Always paste the Design System** at the start
2. **Link to existing files**: "Match the style of customer/index.html"
3. **Be specific about interactions**: "Button morphs, not just changes color"
4. **Request pure HTML**: "No React, no Vue, no Tailwind — pure HTML/CSS/JS"
5. **Name your files**: Always specify exact output filename
6. **Reference the font**: "Use Fredoka One for headings, Nunito 800 for body"
7. **Specify the vibe**: "Cartoon + glassmorphism + animated — feel like a game UI"

---

## 🚀 QUICK START

Open these files in your browser:
- **Hub**: `quickbites/index.html`
- **Customer**: `quickbites/customer/index.html`
- **Admin**: `quickbites/admin/index.html`
- **Rider**: `quickbites/rider/index.html`
- **Track Order**: `quickbites/customer/order-tracking.html`

No server needed — all pure HTML files!
