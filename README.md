# BENTHEG

A responsive luxury-skincare ecommerce concept built as a portfolio demonstration. The brand, products, pricing, and testimonials are fictional.

> Portfolio concept only: checkout and product purchases are intentionally simulated.

## Built with

- **HTML5** — semantic storefront, product dialogs, cart, and account pages
- **CSS3** — responsive layouts, product motion, transitions, and reduced-motion support
- **Vanilla JavaScript** — slideshow, scroll effects, product details, and shopping-bag interactions
- **Firebase Authentication** — email/password registration, sign-in, sign-out, and password reset
- **Vercel** — static hosting configuration and security headers

## Features

- Editorial storefront with responsive campaign storytelling
- Accessible product-detail dialog and interactive shopping bag demo
- Reduced-motion support and mobile navigation
- Firebase email/password registration, sign-in, sign-out, and password reset
- Static deployment configuration for Vercel

## Local preview

Serve the `dist` directory with any static server. For example:

```bash
npx serve dist
```

Firebase Authentication must have the Email/Password provider enabled for account actions to succeed.

## Project structure

```text
dist/
├── index.html          # Storefront
├── portal.html         # Registration and login
├── styles.css          # Storefront styling and motion
├── auth.css            # Account-page styling
├── script.js           # Storefront interactions
├── auth.js             # Authentication forms
├── firebase.js         # Firebase initialization
└── assets/             # Campaign and product imagery
```

## Deployment

The project is configured for Vercel with `dist` as its output directory.
