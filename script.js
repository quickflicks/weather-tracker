async function getWeather() {
    const city = document.getElementById('cityInput').value;
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
    const loadingElement = document.getElementById('loading');

    try {
        // Show loading animation
        loadingElement.style.display = 'block';
        document.getElementById('weatherResult').innerHTML = '';

        // Fetching the geocode data to get latitude, longitude, and country
        const geocodeResponse = await fetch(geocodeUrl);
        const geocodeData = await geocodeResponse.json();

        if (geocodeData.results.length === 0) {
            document.getElementById('weatherResult').innerHTML = 'City not found';
            loadingElement.style.display = 'none'; // Hide loading animation
            return;
        }

        const { latitude, longitude, country } = geocodeData.results[0];

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_min,temperature_2m_max`;

        // Fetching the weather data using latitude and longitude
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();
        const currentWeather = weatherData.current_weather;
        const dailyWeather = weatherData.daily;

        const weatherCodes = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            56: 'Light freezing drizzle',
            57: 'Dense freezing drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            66: 'Light freezing rain',
            67: 'Heavy freezing rain',
            71: 'Slight snow fall',
            73: 'Moderate snow fall',
            75: 'Heavy snow fall',
            77: 'Snow grains',
            80: 'Slight rain showers',
            81: 'Moderate rain showers',
            82: 'Violent rain showers',
            85: 'Slight snow showers',
            86: 'Heavy snow showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with slight hail',
            99: 'Thunderstorm with heavy hail',
        };

        const weatherCode = currentWeather.weathercode;
        const weatherDescription = weatherCodes[weatherCode] || 'Unknown weather';

        // Using OpenWeatherMap icons (corresponding to weather codes)
        const iconMap = {
            0: '01d', 1: '02d', 2: '03d', 3: '04d', 45: '50d',
            48: '50d', 51: '09d', 53: '09d', 55: '09d', 56: '13d',
            57: '13d', 61: '10d', 63: '10d', 65: '10d', 66: '13d',
            67: '13d', 71: '13d', 73: '13d', 75: '13d', 77: '13d',
            80: '09d', 81: '09d', 82: '09d', 85: '13d', 86: '13d',
            95: '11d', 96: '11d', 99: '11d'
        };
        
        const weatherIconUrl = `http://openweathermap.org/img/wn/${iconMap[weatherCode] || '01d'}@2x.png`;

        const weather = `
            <h2>${city}, ${country}</h2>
            <img class="weather-icon" src="${weatherIconUrl}" alt="Weather icon">
            <div class="weather-details">
                <div><img src="http://openweathermap.org/img/wn/01d@2x.png" alt="Temp icon"> <p>Temperature: ${currentWeather.temperature}°C</p></div>
                <div><img src="${weatherIconUrl}" alt="Weather icon"> <p>Weather: ${weatherDescription}</p></div>
                <div><img src="http://openweathermap.org/img/wn/50d@2x.png" alt="Wind icon"> <p>Wind Speed: ${currentWeather.windspeed} m/s</p></div>
                <div><img src="http://openweathermap.org/img/wn/01d@2x.png" alt="Max Temp icon"> <p>Max Temp: ${dailyWeather.temperature_2m_max[0]}°C</p></div>
                <div><img src="http://openweathermap.org/img/wn/01d@2x.png" alt="Min Temp icon"> <p>Min Temp: ${dailyWeather.temperature_2m_min[0]}°C</p></div>
            </div>
        `;
        document.getElementById('weatherResult').innerHTML = weather;
    } catch (error) {
        document.getElementById('weatherResult').innerHTML = 'Error retrieving weather data';
    } finally {
        loadingElement.style.display = 'none'; // Hide loading animation
    }
}