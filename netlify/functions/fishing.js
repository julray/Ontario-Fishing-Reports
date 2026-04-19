export async function handler() {
  try {
    // Elora coordinates
    const lat = 43.683;
    const lon = -80.433;

    // 1) Real weather from Open-Meteo
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
    );
    const weather = await weatherRes.json();

    // 2) Real GRCA flow summary page
    const flowRes = await fetch(
      "https://www.grandriver.ca/our-watershed/river-data/river-and-stream-flows/flow-summary/"
    );
    const flowHtml = await flowRes.text();

    // 3) Real GRCA water temperature page
    const tempRes = await fetch(
      "https://www.grandriver.ca/our-watershed/river-data/water-quality-data/water-temperature/"
    );
    const tempHtml = await tempRes.text();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        weather_current: weather.current || null,
        weather_daily: weather.daily || null,
        grca_flow_page_found: flowHtml.includes("Flow Summary"),
        grca_water_temp_page_found: tempHtml.includes("Water temperature")
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: err.message
      })
    };
  }
}
