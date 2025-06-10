import axios from 'axios';

export default async function handler(req, res) {
  const WEATHERAPI_KEY = process.env.WEATHERAPI_KEY;
  const WEATHERAPI_BASE = 'https://api.weatherapi.com/v1';
  const { city, lat, lon, days = 7 } = req.query;
  let q = city ? city : (lat && lon ? `${lat},${lon}` : null);
  if (!q) return res.status(400).json({ error: 'Please provide city or coordinates' });
  try {
    const url = `${WEATHERAPI_BASE}/forecast.json?key=${WEATHERAPI_KEY}&q=${encodeURIComponent(q)}&days=${days}&aqi=yes&alerts=yes`;
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching WeatherAPI forecast data' });
  }
} 