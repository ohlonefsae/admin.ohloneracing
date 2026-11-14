// functions/api/pages/[id].js
async function requireAuth(request) {
  const cookie = request.headers.get('Cookie') || '';
  return cookie.includes('admin_token=');
}

export async function onRequestPut(context) {
  const { request, env, params } = context;
  if (!(await requireAuth(request))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json();
  const now = new Date().toISOString();

  await env.DB.prepare(
    `UPDATE pages SET slug = ?, title = ?, content_md = ?, published = ?, show_in_nav = ?, updated_at = ? WHERE id = ?`
  )
    .bind(
      body.slug,
      body.title,
      body.content_md || '',
      body.published ? 1 : 0,
      body.show_in_nav ? 1 : 0,
      now,
      params.id
    )
    .run();

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestDelete(context) {
  const { request, env, params } = context;
  if (!(await requireAuth(request))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  await env.DB.prepare(`DELETE FROM pages WHERE id = ?`).bind(params.id).run();
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
