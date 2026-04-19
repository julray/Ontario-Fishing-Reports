export async function handler() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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
                text: `Tell me whether today is a good day to fish for brown trout on the Grand River in Elora, Ontario.

Return ONLY valid JSON in this exact format:
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

  if (!response.ok) {
    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        verdict: "Error",
        summary: JSON.stringify(data),
        best_time: "N/A"
      })
    };
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  try {
    const parsed = JSON.parse(text);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed)
    };
  } catch {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        verdict: "Error",
        summary: text || JSON.stringify(data),
        best_time: "N/A"
      })
    };
  }
}
