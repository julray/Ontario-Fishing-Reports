export async function handler() {
  try {
    const lat = 43.683;
    const lon = -80.433;

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
    );

    if (!weatherRes.ok) {
      throw new Error(`Weather request failed with status ${weatherRes.status}`);
    }

    const weather = await weatherRes.json();

    const flowRes = await fetch(
      "https://www.grandriver.ca/our-watershed/river-data/river-and-stream-flows/flow-summary/"
    );

    if (!flowRes.ok) {
      throw new Error(`GRCA flow page request failed with status ${flowRes.status}`);
    }

    const flowHtml = await flowRes.text();

    const tempRes = await fetch(
      "https://www.grandriver.ca/our-watershed/river-data/water-quality-data/water-temperature/"
    );

    if (!tempRes.ok) {
      throw new Error(`GRCA water temp page request failed with status ${tempRes.status}`);
    }

    const tempHtml = await tempRes.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        weather_current: weather.current || null,
        weather_daily: weather.daily || null,
        grca_flow_page_found: flowHtml.includes("Flow Summary"),
        grca_water_temp_page_found: tempHtml.toLowerCase().includes("water temperature")
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: err.message
      })
    };
  }
}
