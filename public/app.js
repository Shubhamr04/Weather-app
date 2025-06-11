// --- Map Feature ---
let mainMap = null;
let mainMapMarker = null;

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const cityName = document.getElementById('cityName');
const date = document.getElementById('date');
const temp = document.getElementById('temp');
const feelsLike = document.getElementById('feelsLike');
const windSpeed = document.getElementById('windSpeed');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const forecast = document.getElementById('forecast');
const aqiValue = document.getElementById('aqiValue');
const aqiDescription = document.getElementById('aqiDescription');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const uvIndex = document.getElementById('uvIndex');
const weatherAlerts = document.getElementById('weatherAlerts');
const hourlyForecast = document.getElementById('hourlyForecast');
const unitToggle = document.getElementById('unitToggle');
const unitLabel = document.getElementById('unitLabel');
const animatedIcon = document.getElementById('animatedIcon');
const darkModeToggle = document.getElementById('darkModeToggle');
const searchHistoryList = document.getElementById('searchHistory');
const bookmarksList = document.getElementById('bookmarks');
const favoritesGrid = document.getElementById('favoritesGrid');
const compareMetrics = document.getElementById('compareMetrics');
const compareTrendChart = document.getElementById('compareTrendChart');
const compareCity1 = document.getElementById('compareCity1');
const compareCity2 = document.getElementById('compareCity2');
const compareResults = document.getElementById('compareResults');
const compareBtn = document.getElementById('compareBtn');
const micBtn = document.getElementById('micBtn');
const spinner = document.getElementById('spinner');

// Chart instances
let tempChart = null;
let humidityChart = null;
let compareChartInstance = null;

// API Base URL
const API_BASE_URL = 'https://weather-app-pi-nine-56.vercel.app/api';

let currentUnits = 'metric';

window.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cityInput = document.getElementById('cityInput');
    const searchBtn = document.getElementById('searchBtn');
    const locationBtn = document.getElementById('locationBtn');
    const cityName = document.getElementById('cityName');
    const date = document.getElementById('date');
    const temp = document.getElementById('temp');
    const feelsLike = document.getElementById('feelsLike');
    const windSpeed = document.getElementById('windSpeed');
    const humidity = document.getElementById('humidity');
    const pressure = document.getElementById('pressure');
    const forecast = document.getElementById('forecast');
    const aqiValue = document.getElementById('aqiValue');
    const aqiDescription = document.getElementById('aqiDescription');
    const sunrise = document.getElementById('sunrise');
    const sunset = document.getElementById('sunset');
    const uvIndex = document.getElementById('uvIndex');
    const weatherAlerts = document.getElementById('weatherAlerts');
    const hourlyForecast = document.getElementById('hourlyForecast');
    const unitToggle = document.getElementById('unitToggle');
    const unitLabel = document.getElementById('unitLabel');
    const animatedIcon = document.getElementById('animatedIcon');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const searchHistoryList = document.getElementById('searchHistory');
    const bookmarksList = document.getElementById('bookmarks');
    const favoritesGrid = document.getElementById('favoritesGrid');
    const compareMetrics = document.getElementById('compareMetrics');
    const compareTrendChart = document.getElementById('compareTrendChart');
    const compareCity1 = document.getElementById('compareCity1');
    const compareCity2 = document.getElementById('compareCity2');
    const compareResults = document.getElementById('compareResults');
    const compareBtn = document.getElementById('compareBtn');
    const micBtn = document.getElementById('micBtn');
    const spinner = document.getElementById('spinner');

    // Chart instances
    let tempChart = null;
    let humidityChart = null;
    let compareChartInstance = null;

    // API Base URL
    const API_BASE_URL = 'https://weather-app-pi-nine-56.vercel.app/api';

    let currentUnits = 'metric';

    // On page load, try geolocation
    const params = new URLSearchParams(window.location.search);
    const city = params.get('city');
    const lat = params.get('lat');
    const lon = params.get('lon');
    if (city) {
        getAllWeather(city);
    } else if (lat && lon) {
        getAllWeatherByCoords(lat, lon);
    } else {
        getLocationWeather();
    }
    renderSearchHistory();
    renderBookmarks();
    renderFavoritesDashboard();
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (clearHistoryBtn) {
        clearHistoryBtn.onclick = function() {
            localStorage.removeItem('searchHistory');
            renderSearchHistory();
        };
    }

    unitToggle.addEventListener('change', () => {
        currentUnits = unitToggle.checked ? 'imperial' : 'metric';
        unitLabel.textContent = unitToggle.checked ? '°F' : '°C';
        // Re-fetch weather for current city or location
        if (window.lastCoords) {
            getAllWeatherByCoords(window.lastCoords.lat, window.lastCoords.lon);
        } else if (window.lastCity) {
            getAllWeather(window.lastCity);
        }
    });

    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            getAllWeather(city);
        }
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) {
                getAllWeather(city);
            }
        }
    });

    locationBtn.addEventListener('click', getLocationWeather);

    // Dark mode toggle
    if (window.localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        window.localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    // Add Leaflet.js script dynamically if not present
    if (!window.L) {
        const leafletCss = document.createElement('link');
        leafletCss.rel = 'stylesheet';
        leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCss);
        const leafletScript = document.createElement('script');
        leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        document.body.appendChild(leafletScript);
    }

    // Voice Search (Web Speech API)
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        micBtn.addEventListener('click', () => {
            recognition.start();
            micBtn.classList.add('listening');
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            cityInput.value = transcript;
            getAllWeather(transcript);
            micBtn.classList.remove('listening');
        };
        recognition.onend = () => {
            micBtn.classList.remove('listening');
        };
        recognition.onerror = () => {
            micBtn.classList.remove('listening');
        };
    } else {
        micBtn.style.display = 'none';
    }
});

function showSpinner() {
    spinner.style.display = 'block';
}
function hideSpinner() {
    spinner.style.display = 'none';
}

async function getAllWeather(city) {
    try {
        showSpinner();
        await new Promise(res => setTimeout(res, 1000));
        window.lastCity = city;
        const currentData = await fetch(`${API_BASE_URL}/wa-current?city=${city}`).then(res => res.json());
        const forecastData = await fetch(`${API_BASE_URL}/wa-forecast?city=${city}&days=7`).then(res => res.json());
        console.log('Current:', currentData);
        console.log('Forecast:', forecastData);
        if (currentData.error || forecastData.error) throw new Error((currentData.error && currentData.error.message) || (forecastData.error && forecastData.error.message) || 'Unknown error');
        // Only update UI if both succeed
        updateCurrentWeatherWA(currentData);
        updateForecastWA(forecastData);
        updateChartsWA(forecastData);
        updateExtrasWA(forecastData);
        showMainMap(currentData.location.lat, currentData.location.lon);
        saveSearchHistory(city);
        addBookmarkFavoriteButtons(city);
        hideSpinner();
    } catch (error) {
        hideSpinner();
        console.error('Weather fetch error:', error);
        alert('Error fetching weather data. Please try again.');
    }
}

async function getAllWeatherByCoords(lat, lon) {
    try {
        showSpinner();
        await new Promise(res => setTimeout(res, 1000));
        window.lastCoords = { lat, lon };
        const currentData = await fetch(`${API_BASE_URL}/wa-current?lat=${lat}&lon=${lon}`).then(res => res.json());
        const forecastData = await fetch(`${API_BASE_URL}/wa-forecast?lat=${lat}&lon=${lon}&days=7`).then(res => res.json());
        console.log('Current:', currentData);
        console.log('Forecast:', forecastData);
        if (currentData.error || forecastData.error) throw new Error((currentData.error && currentData.error.message) || (forecastData.error && forecastData.error.message) || 'Unknown error');
        // Only update UI if both succeed
        updateCurrentWeatherWA(currentData);
        updateForecastWA(forecastData);
        updateChartsWA(forecastData);
        updateExtrasWA(forecastData);
        showMainMap(lat, lon);
        saveSearchHistory(currentData.location.name);
        hideSpinner();
    } catch (error) {
        hideSpinner();
        console.error('Weather fetch error:', error);
        alert('Error fetching weather data. Please try again.');
    }
}

function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            getAllWeatherByCoords(latitude, longitude);
        }, (error) => {
            alert('Error getting your location. Please try searching by city name.');
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

async function getAirQuality(lat, lon) {
    try {
        const response = await fetch(`${API_BASE_URL}/air-quality?lat=${lat}&lon=${lon}`);
        const data = await response.json();
        updateAirQuality(data);
    } catch (error) {
        console.error('Error fetching air quality data:', error);
    }
}

// Show loading state
function showLoading() {
    cityName.textContent = 'Loading...';
    date.textContent = '--';
    temp.textContent = '--';
    feelsLike.textContent = '--';
    windSpeed.textContent = '--';
    humidity.textContent = '--';
    pressure.textContent = '--';
    aqiValue.textContent = '--';
    aqiDescription.textContent = '--';
    const aqiDetails = document.getElementById('aqiDetails');
    if (aqiDetails) aqiDetails.innerHTML = '';
    animatedIcon.innerHTML = '';
    forecast.innerHTML = '';
    hourlyForecast.innerHTML = '';
    weatherAlerts.classList.remove('active');
    weatherAlerts.innerHTML = '';
}

// Defensive updateCurrentWeatherWA
function updateCurrentWeatherWA(data) {
    if (!data || !data.current || !data.location) {
        showLoading();
        return;
    }
    // Update background based on weather condition
    updateBackground(data.current.condition.text.toLowerCase());
    cityName.textContent = `${data.location.name}, ${data.location.country}`;
    date.textContent = data.location.localtime;
    temp.textContent = `${Math.round(data.current.temp_c)}°C / ${Math.round(data.current.temp_f)}°F`;
    feelsLike.textContent = `Feels like: ${Math.round(data.current.feelslike_c)}°C / ${Math.round(data.current.feelslike_f)}°F`;
    windSpeed.textContent = `${data.current.wind_kph} km/h / ${data.current.wind_mph} mph`;
    humidity.textContent = `${data.current.humidity}%`;
    pressure.textContent = `${data.current.pressure_mb} hPa`;
    // Add weather icon with animation
    const weatherIcon = document.createElement('img');
    weatherIcon.src = data.current.condition.icon;
    weatherIcon.alt = data.current.condition.text;
    weatherIcon.className = 'weather-icon';
    animatedIcon.innerHTML = '';
    animatedIcon.appendChild(weatherIcon);
    // AQI
    if (data.current.air_quality && typeof data.current.air_quality['us-epa-index'] !== 'undefined') {
        const aqi = data.current.air_quality['us-epa-index'];
        aqiValue.textContent = aqi;
        const aqiDescriptions = {
            1: 'Good',
            2: 'Moderate',
            3: 'Unhealthy for Sensitive Groups',
            4: 'Unhealthy',
            5: 'Very Unhealthy',
            6: 'Hazardous'
        };
        aqiDescription.textContent = aqiDescriptions[aqi] || 'Unknown';
    } else {
        aqiValue.textContent = '--';
        aqiDescription.textContent = 'Unavailable';
    }
}

// Defensive updateForecastWA
function updateForecastWA(data) {
    forecast.innerHTML = '';
    data.forecast.forecastday.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'weather-card';
        dayDiv.innerHTML = `
            <div class="forecast-date">${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" class="weather-icon">
            <div class="forecast-temp">
                <span class="max">${Math.round(day.day.maxtemp_c)}°C</span>
                <span class="min">${Math.round(day.day.mintemp_c)}°C</span>
            </div>
            <div class="forecast-condition">${day.day.condition.text}</div>
        `;
        forecast.appendChild(dayDiv);
    });
}

function updateChartsWA(data) {
    // Temperature Chart
    const tempCtx = document.getElementById('tempChart').getContext('2d');
    if (tempChart) tempChart.destroy();
    
    const tempData = data.forecast.forecastday.map(day => ({
        date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        max: day.day.maxtemp_c,
        min: day.day.mintemp_c
    }));

    tempChart = new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: tempData.map(d => d.date),
            datasets: [
                {
                    label: 'Max Temperature (°C)',
                    data: tempData.map(d => d.max),
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Min Temperature (°C)',
                    data: tempData.map(d => d.min),
                    borderColor: '#4dabf7',
                    backgroundColor: 'rgba(77, 171, 247, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Temperature Forecast'
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    // Humidity Chart
    const humidityCtx = document.getElementById('humidityChart').getContext('2d');
    if (humidityChart) humidityChart.destroy();
    
    const humidityData = data.forecast.forecastday.map(day => ({
        date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        humidity: day.day.avghumidity
    }));

    humidityChart = new Chart(humidityCtx, {
        type: 'line',
        data: {
            labels: humidityData.map(d => d.date),
            datasets: [{
                label: 'Humidity (%)',
                data: humidityData.map(d => d.humidity),
                borderColor: '#69db7c',
                backgroundColor: 'rgba(105, 219, 124, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Humidity Forecast'
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function updateExtrasWA(data) {
    // Sunrise/Sunset
    sunrise.textContent = data.forecast.forecastday[0].astro.sunrise;
    sunset.textContent = data.forecast.forecastday[0].astro.sunset;
    // UV Index
    const uv = data.forecast.forecastday[0].day.uv;
    uvIndex.textContent = uv;
    uvIndex.className = '';
    if (uv < 3) uvIndex.classList.add('uv-low');
    else if (uv < 6) uvIndex.classList.add('uv-moderate');
    else if (uv < 8) uvIndex.classList.add('uv-high');
    else if (uv < 11) uvIndex.classList.add('uv-very-high');
    else uvIndex.classList.add('uv-extreme');
    // Weather Alerts
    if (data.alerts && data.alerts.alert && data.alerts.alert.length > 0) {
        weatherAlerts.classList.add('active');
        weatherAlerts.innerHTML = data.alerts.alert.map(alert => `<strong>${alert.event}:</strong> ${alert.desc}`).join('<br>');
    } else {
        weatherAlerts.classList.remove('active');
        weatherAlerts.innerHTML = '';
    }
    // Hourly Forecast
    hourlyForecast.innerHTML = '';
    data.forecast.forecastday[0].hour.slice(0, 12).forEach(hour => {
        const hourDiv = document.createElement('div');
        hourDiv.className = 'hourly-item';
        hourDiv.innerHTML = `
            <div>${hour.time.split(' ')[1]}</div>
            <img src="${hour.condition.icon}" alt="${hour.condition.text}">
            <div>${Math.round(hour.temp_c)}°C</div>
            <div><i class="fas fa-wind"></i> ${hour.wind_kph} km/h</div>
            <div><i class="fas fa-tint"></i> ${hour.humidity}%</div>
        `;
        hourlyForecast.appendChild(hourDiv);
    });
    setDynamicBackground(data.current ? data.current.condition.text : data.forecast.forecastday[0].day.condition.text);
}

function updateAirQuality(data) {
    const aqi = data.list[0].main.aqi;
    aqiValue.textContent = aqi;
    
    const aqiDescriptions = {
        1: 'Good',
        2: 'Fair',
        3: 'Moderate',
        4: 'Poor',
        5: 'Very Poor'
    };
    
    aqiDescription.textContent = aqiDescriptions[aqi] || 'Unknown';
}

function updateCharts(data) {
    const dailyData = groupForecastByDay(data.list);
    const labels = dailyData.map(day => 
        new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })
    );
    const temperatures = dailyData.map(day => day.main.temp);
    const humidities = dailyData.map(day => day.main.humidity);

    // Update temperature chart
    if (tempChart) {
        tempChart.destroy();
    }
    tempChart = new Chart(document.getElementById('tempChart'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                borderColor: '#ff6b6b',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(255, 107, 107, 0.1)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });

    // Update humidity chart
    if (humidityChart) {
        humidityChart.destroy();
    }
    humidityChart = new Chart(document.getElementById('humidityChart'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Humidity (%)',
                data: humidities,
                borderColor: '#4dabf7',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(77, 171, 247, 0.1)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

function groupForecastByDay(forecastList) {
    const dailyData = {};
    
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dailyData[date]) {
            dailyData[date] = {
                dt: item.dt,
                main: { ...item.main },
                weather: [...item.weather]
            };
        }
    });
    
    return Object.values(dailyData);
}

function formatTime(unix, offset, hourOnly) {
    const date = new Date((unix + (offset || 0)) * 1000);
    if (hourOnly) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function setDynamicBackground(condition) {
    console.log('Setting dynamic background for condition:', condition);
    const body = document.body;
    body.className = '';
    if (condition.includes('Sunny')) body.classList.add('bg-sunny');
    else if (condition.includes('Cloud')) body.classList.add('bg-cloud');
    else if (condition.includes('Rain')) body.classList.add('bg-rain');
    else if (condition.includes('Snow')) body.classList.add('bg-snow');
    else if (condition.includes('Thunder')) body.classList.add('bg-thunder');
    else if (condition.includes('Drizzle')) body.classList.add('bg-drizzle');
    else if (condition.includes('Mist')) body.classList.add('bg-mist');
}

// --- Search History & Bookmarks ---
function saveSearchHistory(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    history = history.filter(c => c.toLowerCase() !== city.toLowerCase());
    history.unshift(city);
    if (history.length > 5) history = history.slice(0, 5);
    localStorage.setItem('searchHistory', JSON.stringify(history));
    // Only update dropdown menu now
    window.dispatchEvent(new Event('recentSearchesUpdated'));
}
function renderSearchHistory() {
    // No-op: handled by dropdown menu
}
function saveBookmark(city) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    if (!bookmarks.includes(city)) {
        bookmarks.push(city);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        window.dispatchEvent(new Event('bookmarkedCitiesUpdated'));
    }
}
function removeBookmark(city) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    bookmarks = bookmarks.filter(c => c !== city);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    window.dispatchEvent(new Event('bookmarkedCitiesUpdated'));
}
function renderBookmarks() {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    bookmarksList.innerHTML = '';
    bookmarks.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.onclick = () => getAllWeather(city);
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✕';
        removeBtn.style.marginLeft = '8px';
        removeBtn.onclick = (e) => { e.stopPropagation(); removeBookmark(city); };
        li.appendChild(removeBtn);
        bookmarksList.appendChild(li);
    });
}
// --- Favorite Cities Dashboard ---
function saveFavorite(city) {
    let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favs.includes(city)) {
        favs.push(city);
        localStorage.setItem('favorites', JSON.stringify(favs));
        renderFavoritesDashboard();
    }
}
function removeFavorite(city) {
    let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    favs = favs.filter(c => c !== city);
    localStorage.setItem('favorites', JSON.stringify(favs));
    renderFavoritesDashboard();
}
async function renderFavoritesDashboard() {
    let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    favoritesGrid.innerHTML = '';
    for (const city of favs) {
        const weatherData = await fetch(`${API_BASE_URL}/wa-current?city=${city}`).then(res => res.json());
        const card = document.createElement('div');
        card.className = 'favorite-card';
        card.innerHTML = `
            <button class="remove-fav" title="Remove from favorites">✕</button>
            <h4>${weatherData.location.name}</h4>
            <div>${Math.round(weatherData.current.temp_c)}°C / ${Math.round(weatherData.current.temp_f)}°F</div>
            <div>${weatherData.current.condition.text}</div>
            <div><img src="${weatherData.current.condition.icon}"></div>
        `;
        card.querySelector('.remove-fav').onclick = () => removeFavorite(city);
        favoritesGrid.appendChild(card);
    }
}

// --- Map Feature ---
function showMainMap(lat, lon) {
    // Wait for Leaflet to be loaded
    if (typeof L === 'undefined') {
        setTimeout(() => showMainMap(lat, lon), 100);
        return;
    }
    const mapDiv = document.getElementById('weatherMap');
    if (!mapDiv) return;
    if (!mainMap) {
        mainMap = L.map('weatherMap').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mainMap);
        mainMapMarker = L.marker([lat, lon]).addTo(mainMap);
    } else {
        mainMap.setView([lat, lon], 10);
        if (mainMapMarker) {
            mainMapMarker.setLatLng([lat, lon]);
        } else {
            mainMapMarker = L.marker([lat, lon]).addTo(mainMap);
        }
    }
}

function addBookmarkFavoriteButtons(city) {
    // Find or create the container for the button
    let btnContainer = document.getElementById('bookmarkBtnContainer');
    if (!btnContainer) {
        btnContainer = document.createElement('div'); // use div for block layout
        btnContainer.id = 'bookmarkBtnContainer';
        btnContainer.style.display = 'block';
        btnContainer.style.marginTop = '10px';
        cityName.parentNode.appendChild(btnContainer);
    }
    btnContainer.innerHTML = '';
    // Create the bookmark button
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const isBookmarked = bookmarks.includes(city);
    const btn = document.createElement('button');
    btn.innerHTML = isBookmarked ? '★ Bookmarked' : '☆ Bookmark';
    btn.style.padding = '0.4em 1em';
    btn.style.borderRadius = '20px';
    btn.style.border = 'none';
    btn.style.background = isBookmarked ? '#ffb347' : '#222';
    btn.style.color = isBookmarked ? '#222' : '#fff';
    btn.style.fontWeight = 'bold';
    btn.style.cursor = 'pointer';
    btn.onclick = function() {
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        if (isBookmarked) {
            bookmarks = bookmarks.filter(c => c !== city);
        } else {
            bookmarks.push(city);
        }
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        renderBookmarks();
        addBookmarkFavoriteButtons(city); // re-render button
    };
    btnContainer.appendChild(btn);
}

// Advanced Dropdown Menu Logic
(function() {
  const menuBtn = document.getElementById('dropdownMenuBtn');
  const menu = document.getElementById('dropdownMenu');
  const collapsibles = menu.querySelectorAll('.collapsible');
  let isMobile = window.matchMedia('(max-width: 768px)').matches;

  // Helper: Get/set localStorage arrays
  function getArray(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch { return []; }
  }
  function setArray(key, arr) {
    localStorage.setItem(key, JSON.stringify(arr));
  }

  // Render lists
  function renderList(listEl, arr, emptyMsg) {
    if (!arr.length) {
      listEl.innerHTML = `<li style='color:#888;font-style:italic;'>${emptyMsg}</li>`;
    } else {
      listEl.innerHTML = arr.map(city => `<li>${city}</li>`).join('');
    }
  }

  // Update menu lists
  function updateMenu() {
    const recentList = menu.querySelector('.recent-searches-list');
    const bookmarksList = menu.querySelector('.bookmarked-cities-list');
    renderList(recentList, getArray('recentSearches'), 'No recent searches');
    renderList(bookmarksList, getArray('bookmarkedCities'), 'No bookmarks');
  }

  // Initial render
  updateMenu();

  // Toggle menu open/close
  menuBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    menu.classList.toggle('open');
    updateMenu(); // Always update when opening
  });

  // Collapse/expand sections
  collapsibles.forEach(section => {
    const header = section.querySelector('.dropdown-section-header');
    header.addEventListener('click', function(e) {
      section.classList.toggle('collapsed');
    });
    if (isMobile) section.classList.add('collapsed');
  });

  // Close menu on outside click
  document.addEventListener('click', function(e) {
    if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
      menu.classList.remove('open');
    }
  });

  // Close menu on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') menu.classList.remove('open');
  });

  // Auto-close on mobile after selection
  menu.addEventListener('click', function(e) {
    if (isMobile && e.target.closest('a,button')) {
      menu.classList.remove('open');
    }
  });

  // Optional: update isMobile on resize
  window.addEventListener('resize', function() {
    isMobile = window.matchMedia('(max-width: 768px)').matches;
  });

  // Clear history button
  const clearBtn = menu.querySelector('.clear-history-btn');
  clearBtn.addEventListener('click', function() {
    setArray('recentSearches', []);
    updateMenu();
  });

  // Listen for app events to update menu live
  window.addEventListener('recentSearchesUpdated', updateMenu);
  window.addEventListener('bookmarkedCitiesUpdated', updateMenu);

  // Optionally, patch your app's search/bookmark logic to dispatch these events after updating localStorage
  // Example:
  // window.dispatchEvent(new Event('recentSearchesUpdated'));
  // window.dispatchEvent(new Event('bookmarkedCitiesUpdated'));

})();