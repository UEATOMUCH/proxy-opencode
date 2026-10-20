export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }

  const url = new URL(request.url);
  const cleanPath = url.pathname.replace(/^\/v1/, '').replace(/^\/api\/proxy/, '');
  const targetUrl = 'https://opencode.ai/zen/go/v1' + cleanPath + url.search;

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('x-forwarded-for');
  headers.delete('x-real-ip');
  headers.set('User-Agent', 'my-coding-agent/1.0');
  headers.set('x-opencode-session', 'jai-lorebary-session-888');

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
    });

    const resHeaders = new Headers(response.headers);
    resHeaders.set('Access-Control-Allow-Origin', '*');

    return new Response(response.body, {
      status: response.status,
      headers: resHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
