export async function handler() {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      tools: [{ type: "web_search" }],
      input: `Determine whether today is a good day to fish for brown trout on the Grand River in Elora, Ontario.

Return ONLY valid JSON:
{
  "verdict": "",
  "summary": "",
  "best_time": ""
}`
    })
  });

  const result = await response.json();

  // Extract text
  const text = result.output[0].content[0].text;

  // Parse JSON safely
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    parsed = {
      verdict: "Error",
      summary: text,
      best_time: "N/A"
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(parsed)
  };
}
