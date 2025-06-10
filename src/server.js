const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
console.log('API KEY:', process.env.OPENWEATHER_API_KEY);
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Serve landing.html as the default page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/landing.html'));
});

// OpenWeatherMap API configuration
const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// WeatherAPI.com configuration
const WEATHERAPI_KEY = process.env.WEATHERAPI_KEY;
const WEATHERAPI_BASE = 'https://api.weatherapi.com/v1';

// Routes
app.get('/api/weather', async (req, res) => {
     console.log('Received query:', req.query);
    try {
        const { city, lat, lon } = req.query;
        
        let url;
        

        if (city) {
            url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
        } else if (lat && lon) {
            url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        } else {
            return res.status(400).json({ error: 'Please provide either city name or coordinates' });
        }
        console.log('Requesting URL:', url);

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

app.get('/api/forecast', async (req, res) => {
    try {
        const { city, lat, lon } = req.query;
        let url;

        if (city) {
            url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
        } else if (lat && lon) {
            url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        } else {
            return res.status(400).json({ error: 'Please provide either city name or coordinates' });
        }

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching weather data' });
        //res.status(500).json({ error: 'Error fetching forecast data' });
    }
});

app.get('/api/air-quality', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) {
            return res.status(400).json({ error: 'Please provide coordinates' });
        }

        const url = `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        //console.error('Weather API error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error fetching weather data' });
        //res.status(500).json({ error: 'Error fetching air quality data' });
    }
});

// One Call API endpoint for advanced weather features
app.get('/api/onecall', async (req, res) => {
    try {
        const { lat, lon, units = 'metric' } = req.query;
        if (!lat || !lon) {
            return res.status(400).json({ error: 'Please provide coordinates' });
        }
        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        //console.error('One Call API error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error fetching advanced weather data' });
    }
});

// WeatherAPI.com: Current weather
app.get('/api/wa-current', async (req, res) => {
    try {
        const { city, lat, lon } = req.query;
        let q = city ? city : (lat && lon ? `${lat},${lon}` : null);
        if (!q) return res.status(400).json({ error: 'Please provide city or coordinates' });
        const url = `${WEATHERAPI_BASE}/current.json?key=${WEATHERAPI_KEY}&q=${encodeURIComponent(q)}&aqi=yes`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching WeatherAPI current data' });
    }
});

// WeatherAPI.com: 7-day forecast (with hourly)
app.get('/api/wa-forecast', async (req, res) => {
    try {
        const { city, lat, lon, days = 7 } = req.query;
        let q = city ? city : (lat && lon ? `${lat},${lon}` : null);
        if (!q) return res.status(400).json({ error: 'Please provide city or coordinates' });
        const url = `${WEATHERAPI_BASE}/forecast.json?key=${WEATHERAPI_KEY}&q=${encodeURIComponent(q)}&days=${days}&aqi=yes&alerts=yes`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('WeatherAPI forecast error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error fetching WeatherAPI forecast data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 