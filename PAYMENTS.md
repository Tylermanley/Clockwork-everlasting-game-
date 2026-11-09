# Setting up real payments for the Clockwork Boutique

The boutique ships in **test mode**: purchases are free and only for testing. To sell the cosmetics for real money you need two things only you can set up:

1. **A Stripe account** (https://stripe.com). It handles card payments, receipts, refunds and payouts.
2. **A tiny server** that creates checkout sessions and confirms payments. A free Cloudflare Worker is enough, and `server/stripe-worker.example.js` is a starting point.

> ⚠️ The example server is a template, not a tested, production-ready service. Read it, test it with Stripe's **test keys** first, and never put your secret key in the game files. It belongs only in the server's environment variables.

## Steps

1. In the Stripe dashboard, create a **Product + Price** for each boutique item (IDs are in `js/shop.js`, e.g. `outfit_hero_royal`, `pack_supporter`). Note each price ID (`price_...`).
2. Create a Cloudflare Worker from `server/stripe-worker.example.js` and set these secrets:
   - `STRIPE_SECRET_KEY`: your Stripe secret key (start with the `sk_test_...` key)
   - `PRICE_IDS`: JSON mapping item IDs to Stripe price IDs, e.g. `{"outfit_hero_royal":"price_123", "pack_supporter":"price_456"}`
   - `ALLOWED_ORIGIN`: the URL your game is served from, e.g. `https://tylermanley.github.io`
3. Deploy the worker, then edit `PAYMENTS` at the top of `js/shop.js`:
   ```js
   const PAYMENTS = {
     mode: 'live',
     checkoutEndpoint: 'https://YOUR-WORKER.workers.dev/checkout',
     verifyEndpoint: 'https://YOUR-WORKER.workers.dev/verify',
     currency: 'USD',
   };
   ```
4. Test the full flow with Stripe's test card `4242 4242 4242 4242`, then switch to your live key.

## Things to decide yourself

- **Prices, taxes and refunds.** Stripe Tax can help with sales tax and VAT.
- **App stores.** If you ever wrap the game for the Apple App Store or Google Play, their rules require their own in-app purchase systems for digital items (with a 15–30% fee) instead of Stripe.
- **Keep it fair.** The boutique is cosmetic-only by design: no pay-to-win items and no random loot boxes, which are restricted by law in some countries.
