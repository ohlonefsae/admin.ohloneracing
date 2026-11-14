// functions/api/pages/public.js
export async function onRequestGet(context) {
  const { env } = context;
  const { results } = await env.DB.prepare(
    `SELECT slug, title FROM pages WHERE published = 1 AND show_in_nav = 1 ORDER BY title`
  ).all();

  return new Response(JSON.stringify(results || []), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}
