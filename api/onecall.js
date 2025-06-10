import axios from 'axios';

export default async function handler(req, res) {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  const { lat, lon, units = 'metric' } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Please provide coordinates' });
  }
  try {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching advanced weather data' });
  }
} 