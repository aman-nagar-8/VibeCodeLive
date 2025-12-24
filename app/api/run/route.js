

export async function POST(req ) {
  const { code, language_id, input } = await req.json();

  const response = await fetch(
    "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": process.env.RAPID_HOST,
        "x-rapidapi-key": process.env.RAPID_KEY,
      },
      body: JSON.stringify({
        source_code: code,
        language_id,
        stdin: input,
      }),
    }
  );

  const data = await response.json();
  return new Response(JSON.stringify(data), { status: 200 });
}

export async function GET(req) {
    return Response.json("Hello in api/run");
}