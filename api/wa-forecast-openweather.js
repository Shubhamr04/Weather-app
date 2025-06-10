import axios from 'axios';

export default async function handler(req, res) {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';
  const { city, lat, lon } = req.query;
  let url;
  if (city) {
    url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
  } else if (lat && lon) {
    url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  } else {
    return res.status(400).json({ error: 'Please provide either city name or coordinates' });
  }
  try {
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching weather data' });
  }
} 