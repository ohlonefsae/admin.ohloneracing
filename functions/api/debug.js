export async function onRequestGet(context) {
  const { env } = context;
  return new Response(JSON.stringify({
    hasPassword: !!env.ADMIN_PASSWORD,
    passwordLength: env.ADMIN_PASSWORD ? env.ADMIN_PASSWORD.length : 0
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
