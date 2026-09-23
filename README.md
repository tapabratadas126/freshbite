## Important
The social links use text labels (IG, f, X, YT) instead of brand icons because current lucide-react versions do not export social brand icons.

# FreshBite — React Grocery UI Clone

A responsive React + Vite implementation based on the provided fresh-produce UI mockup.

## Included
- Hero carousel with arrows/dots and promo badges
- Responsive header/navigation
- Functional search routing to the Shop page
- Shop page with search, category filter and price sorting
- Product quick-view modal
- Persistent shopping cart using `localStorage`
- Add/remove/increment/decrement cart items
- Functional demo checkout action
- About, Testimonials, Clients, Pricing and Contact pages
- Contact form feedback state
- Newsletter subscription feedback state
- Responsive desktop/tablet/mobile layouts
- Vercel SPA rewrite configuration
- Image assets cropped from the supplied UI reference for closer visual matching

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

This is a front-end implementation. Payment processing, authentication, inventory, order storage and server-side form delivery are not connected to a backend.
