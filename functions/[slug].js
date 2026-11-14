// functions/[slug].js — renders a published page
import { marked } from 'https://cdn.jsdelivr.net/npm/marked@15/+esm';

export async function onRequestGet(context) {
  const { env, params } = context;
  const slug = params.slug;

  const page = await env.DB.prepare(
    `SELECT title, content_md FROM pages WHERE slug = ? AND published = 1`
  )
    .bind(slug)
    .first();

  if (!page) {
    return new Response('Page not found', { status: 404 });
  }

  const html = marked.parse(page.content_md || '');

  const fullPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(page.title)} — Ohlone Renegades Racing</title>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = { theme: { extend: { colors: { renegade: { green: '#0B2318', gold: '#F2A91E' } }, fontFamily: { display: ['Barlow Condensed','sans-serif'], sans: ['Inter','sans-serif'] } } } };
  </script>
</head>
<body class="bg-stone-50 text-stone-900 font-sans">
  <header class="bg-renegade-green text-white border-b border-renegade-gold/30">
    <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
      <a href="/" class="font-display font-black text-xl uppercase">Ohlone <span class="text-renegade-gold">Racing</span></a>
      <a href="/" class="text-xs uppercase tracking-wider text-stone-300 hover:text-white">← Back to Home</a>
    </div>
  </header>
  <main class="max-w-3xl mx-auto px-4 py-10">
    <h1 class="font-display font-black text-4xl uppercase text-renegade-green mb-6">${escapeHtml(page.title)}</h1>
    <article class="prose prose-stone max-w-none">${html}</article>
  </main>
</body>
</html>`;

  return new Response(fullPage, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"');
}
