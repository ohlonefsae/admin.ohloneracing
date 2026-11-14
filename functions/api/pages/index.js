// functions/api/pages/index.js
async function requireAuth(request, env) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/admin_token=([^;]+)/);
  if (!match) return false;
  // In a real setup, validate the token against KV or D1.
  // For this starter we accept any token set by /api/login.
  return true;
}

export async function onRequestGet(context) {
  const { request, env } = context;
  if (!(await requireAuth(request, env))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { results } = await env.DB.prepare(
    `SELECT id, slug, title, published, show_in_nav, updated_at FROM pages ORDER BY updated_at DESC`
  ).all();

  return new Response(JSON.stringify(results || []), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!(await requireAuth(request, env))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO pages (id, slug, title, content_md, published, show_in_nav, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      body.slug,
      body.title,
      body.content_md || '',
      body.published ? 1 : 0,
      body.show_in_nav ? 1 : 0,
      now,
      now
    )
    .run();

  return new Response(JSON.stringify({ id, ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
