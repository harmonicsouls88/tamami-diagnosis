// netlify/functions/send.js
exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    console.log("received:", body);

    // ここでは何も送らず OK を返すだけ（疎通テスト用）
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, echo: body }),
    };
  } catch (e) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, error: String(e) }),
    };
  }
}

// send.js（Netlify Function）
export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      }
    });
  }

  // …既存の処理（Make へ POST → そのレスポンス返却）

  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    }
  });
}