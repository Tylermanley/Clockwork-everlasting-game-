// Example Cloudflare Worker for the Clockwork Boutique: a starting point, NOT production-tested.
// Endpoints:
//   GET /checkout?item=ID&player=PID&return=URL  → redirects to a Stripe Checkout page
//   GET /verify?session=SESSION_ID&player=PID    → { items: [...] } once the session is paid
// Secrets (wrangler secret put ...): STRIPE_SECRET_KEY, PRICE_IDS (JSON), ALLOWED_ORIGIN

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = { 'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*' };
    const prices = JSON.parse(env.PRICE_IDS || '{}');
    const stripe = (path, init = {}) => fetch(`https://api.stripe.com/v1/${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded', ...(init.headers || {}) },
    }).then(r => r.json());

    if (url.pathname === '/checkout') {
      const item = url.searchParams.get('item');
      const player = url.searchParams.get('player') || '';
      const back = url.searchParams.get('return') || env.ALLOWED_ORIGIN;
      if (!prices[item]) return new Response('Unknown item', { status: 400, headers: cors });
      if (env.ALLOWED_ORIGIN && !back.startsWith(env.ALLOWED_ORIGIN)) return new Response('Bad return URL', { status: 400, headers: cors });
      const body = new URLSearchParams({
        mode: 'payment',
        'line_items[0][price]': prices[item],
        'line_items[0][quantity]': '1',
        success_url: `${back}?purchase_session={CHECKOUT_SESSION_ID}`,
        cancel_url: back,
        client_reference_id: player,
        'metadata[item]': item,
      });
      const session = await stripe('checkout/sessions', { method: 'POST', body });
      if (!session.url) return new Response('Checkout error', { status: 502, headers: cors });
      return Response.redirect(session.url, 303);
    }

    if (url.pathname === '/verify') {
      const id = url.searchParams.get('session');
      const player = url.searchParams.get('player') || '';
      if (!id) return Response.json({ items: [] }, { headers: cors });
      const session = await stripe(`checkout/sessions/${encodeURIComponent(id)}`);
      const paid = session.payment_status === 'paid' && session.client_reference_id === player;
      return Response.json({ items: paid ? [session.metadata.item] : [] }, { headers: cors });
    }

    return new Response('Not found', { status: 404, headers: cors });
  },
};
