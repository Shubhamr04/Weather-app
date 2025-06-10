# Weather Forecast Application

A beautiful weather forecast application built with vanilla HTML, CSS, and JavaScript, using Node.js and Express for the backend.

## Features

- Current weather conditions
- 7-day weather forecast
- Air Quality Index (AQI)
- Temperature and humidity trend graphs
- Location-based weather search
- City name search
- Beautiful animated background
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- OpenWeatherMap API key

## Setup

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   OPENWEATHER_API_KEY=your_api_key_here
   ```
   Replace `your_api_key_here` with your OpenWeatherMap API key. You can get one by signing up at [OpenWeatherMap](https://openweathermap.org/api).

## Running the Application

1. Start the server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `/api/weather` - Get current weather data
  - Query parameters: `city` or `lat` and `lon`
- `/api/forecast` - Get 7-day forecast
  - Query parameters: `city` or `lat` and `lon`
- `/api/air-quality` - Get air quality data
  - Query parameters: `lat` and `lon`

## Technologies Used

- Frontend:
  - HTML5
  - CSS3 (with animations and gradients)
  - Vanilla JavaScript
  - Chart.js for data visualization
  - Font Awesome for icons

- Backend:
  - Node.js
  - Express.js
  - Axios for API requests
  - dotenv for environment variables

## License

MIT 