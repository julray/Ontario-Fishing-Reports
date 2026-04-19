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
                text: `Today's date is ${new Date().toLocaleDateString("en-CA")}.

Location: Grand River, Elora, Ontario.

Use the Grand River Conservation Authority (GRCA) river data pages for current river conditions, especially flow, water temperature, and related watershed/weather data where available.

For each species below:
1. Say whether the season is OPEN or CLOSED in Ontario Zone 16.
2. If open, give a fishing verdict for TODAY: GOOD, FAIR, or POOR.
3. Use current public information, prioritizing GRCA data.
4. Keep it practical and short.

Species:
- Brown Trout
- Rainbow Trout
- Northern Pike

Return ONLY valid JSON in this exact format:
{
  "species": [
    {
      "name": "",
      "season": "OPEN or CLOSED",
      "verdict": "GOOD / FAIR / POOR / N/A",
      "reason": "",
      "best_time": ""
    }
  ]
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
        species: [
          {
            name: "Error",
            season: "N/A",
            verdict: "N/A",
            reason: JSON.stringify(data),
            best_time: "N/A"
          }
        ]
      })
    };
  }

  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const text = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

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
        species: [
          {
            name: "Error",
            season: "N/A",
            verdict: "N/A",
            reason: text || "Could not parse Gemini response.",
            best_time: "N/A"
          }
        ]
      })
    };
  }
}
