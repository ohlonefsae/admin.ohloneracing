// functions/api/login.js
export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json().catch(() => ({}));
  const password = body.password || '';

  if (password !== env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: 'Invalid password' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Simple session token (in production consider a signed JWT or KV session)
  const token = crypto.randomUUID();
  // Store token → timestamp in a simple way; for demo we just return it
  // Real apps should store in KV or D1 sessions table

  return new Response(JSON.stringify({ ok: true, token }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `admin_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`,
    },
  });
}
