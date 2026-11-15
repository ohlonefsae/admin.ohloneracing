// functions/api/pages/[id].js

// Handle CORS preflight requests
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Handle GET requests for a single page (allows loading both published pages and drafts in admin)
export async function onRequestGet(context) {
  const { env, params } = context;
  const idOrSlug = params.id;

  try {
    const page = await env.DB.prepare(
      `SELECT * FROM pages WHERE id = ? OR slug = ?`
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

// Handle PUT requests to update an existing page
export async function onRequestPut(context) {
  const { env, params, request } = context;
  const id = params.id;

  try {
    const body = await request.json();
    const { title, slug, content_md, published, show_in_nav } = body;

    if (!title || !slug) {
      return new Response(JSON.stringify({ error: 'Title and slug are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    await env.DB.prepare(
      `UPDATE pages SET title = ?, slug = ?, content_md = ?, published = ?, show_in_nav = ? WHERE id = ?`
    )
      .bind(title, slug, content_md || '', published ? 1 : 0, show_in_nav ? 1 : 0, id)
      .run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 
        'Content-Type': 'application/json',
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

// Handle DELETE requests to remove a page
export async function onRequestDelete(context) {
  const { env, params } = context;
  const id = params.id;

  try {
    await env.DB.prepare(`DELETE FROM pages WHERE id = ?`)
      .bind(id)
      .run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 
        'Content-Type': 'application/json',
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
