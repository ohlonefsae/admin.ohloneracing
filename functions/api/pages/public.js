// functions/api/pages/public.js
export async function onRequestGet(context) {
  const { env } = context;

  try {
    const { results } = await env.DB.prepare(
      `SELECT slug, title, updated_at FROM pages WHERE published = 1 ORDER BY created_at DESC`
    ).all();

    return new Response(JSON.stringify(results), {
      headers: { 
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*' // Allows main site to fetch from admin subdomain
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
