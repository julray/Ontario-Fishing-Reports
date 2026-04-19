export async function handler() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Is today a good day to fish for brown trout on the Grand River in Elora, Ontario?

Return ONLY JSON:
{
  "verdict": "",
  "summary": "",
  "best_time": ""
}`
              }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();

  let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = {
      verdict: "Error",
      summary: text,
      best_time: "N/A"
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(parsed)
  };
}
