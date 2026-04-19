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
      input: "Determine whether today is a good day to fish for brown trout on the Grand River in Elora, Ontario. Return concise practical advice.",
      text: {
        format: {
          type: "json_schema",
          name: "fishing_report",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              verdict: { type: "string" },
              summary: { type: "string" },
              best_time: { type: "string" }
            },
            required: ["verdict", "summary", "best_time"]
          }
        }
      }
    })
  });

  const result = await response.json();

  if (!response.ok) {
    return {
      statusCode: response.status,
      body: JSON.stringify({
        verdict: "Error",
        summary: result.error?.message || "OpenAI request failed.",
        best_time: "N/A"
      })
    };
  }

  let parsed;

  try {
    parsed = JSON.parse(result.output_text);
  } catch (e) {
    parsed = {
      verdict: "Error",
      summary: "Could not parse model response.",
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
