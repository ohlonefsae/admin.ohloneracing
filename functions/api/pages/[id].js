// functions/api/pages/[id].js

// Handle CORS preflight requests
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Handle GET requests for a single page
export async function onRequestGet(context) {
  const { env, params } = context;
  const idOrSlug = params.id; // Cloudflare names the dynamic parameter file [id].js -> params.id

  try {
    // Query D1 database by ID or Slug
    const page = await env.DB.prepare(
      `SELECT * FROM pages WHERE (id = ? OR slug = ?) AND published = 1`
    )
      .bind(idOrSlug, idOrSlug)
      .first();

    if (!page) {
      return new Response(JSON.stringify({ error: 'Page not found' }), {
        status: 404,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        },
      });
    }

    return new Response(JSON.stringify(page), {
      headers: { 
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*' 
      },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
    });
  }
}
