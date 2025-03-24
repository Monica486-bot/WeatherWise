document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const config = {
        apiKey: '2b5fc755ac2ec59250868b5527df31c4', // Replace with your actual API key
        baseUrl: 'https://api.openweathermap.org/data/2.5/',
        units: 'metric',
        iconUrl: 'https://openweathermap.org/img/wn/'
    };

    // DOM Elements
    const elements = {
        searchForm: document.getElementById('search-form'),
        cityInput: document.getElementById('city'),
        weatherResult: document.getElementById('weather-result'),
        forecastResult: document.getElementById('forecast-result'),
        unitToggle: document.getElementById('unit-toggle'),
        loadingIndicator: document.getElementById('loading-indicator')
    };

    // State
    let currentUnit = 'metric';

    // Event Listeners
    elements.searchForm.addEventListener('submit', handleSearch);
    elements.unitToggle.addEventListener('change', toggleTemperatureUnit);

    // Main Functions
    async function handleSearch(e) {
        e.preventDefault();
        const city = elements.cityInput.value.trim();
        
        if (!city) {
            showError('Please enter a city name');
            return;
        }

        try {
            showLoading(true);
            const currentWeather = await fetchWeather(city);
            const forecast = await fetchForecast(city);
            displayWeather(currentWeather);
            displayForecast(forecast);
        } catch (error) {
            console.error('Error:', error);
            showError(error.message || 'Failed to fetch weather data. Please try again.');
        } finally {
            showLoading(false);
        }
    }

    async function fetchWeather(city) {
        const url = `${config.baseUrl}weather?q=${city}&appid=${config.apiKey}&units=${currentUnit}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch weather');
        }
        
        return await response.json();
    }

    async function fetchForecast(city) {
        const url = `${config.baseUrl}forecast?q=${city}&appid=${config.apiKey}&units=${currentUnit}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch forecast');
        }
        
        const data = await response.json();
        return processForecastData(data);
    }

    function processForecastData(data) {
        // Group forecast by day and get midday forecast for each day
        const forecastByDay = data.list.reduce((acc, item) => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            
            // Only take one forecast per day (around midday)
            if (!acc[date] && new Date(item.dt * 1000).getHours() >= 11) {
                acc[date] = item;
            }
            
            return acc;
        }, {});

        return Object.values(forecastByDay).slice(0, 5); // Get next 5 days
    }

    function displayWeather(data) {
        const unitSymbol = currentUnit === 'metric' ? '°C' : '°F';
        const windUnit = currentUnit === 'metric' ? 'm/s' : 'mph';
        const windSpeed = currentUnit === 'metric' ? data.wind.speed : (data.wind.speed * 2.237).toFixed(1);
        
        elements.weatherResult.innerHTML = `
            <div class="current-weather">
                <h2>${data.name}, ${data.sys.country}</h2>
                <div class="weather-main">
                    <img src="${config.iconUrl}${data.weather[0].icon}@2x.png" 
                         alt="${data.weather[0].description}">
                    <div class="weather-temp">${Math.round(data.main.temp)}${unitSymbol}</div>
                </div>
                <div class="weather-details">
                    <p><strong>Feels like:</strong> ${Math.round(data.main.feels_like)}${unitSymbol}</p>
                    <p><strong>Conditions:</strong> ${capitalizeFirstLetter(data.weather[0].description)}</p>
                    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                    <p><strong>Wind:</strong> ${windSpeed} ${windUnit}</p>
                    <p><strong>Pressure:</strong> ${data.main.pressure} hPa</p>
                    <p><strong>Visibility:</strong> ${(data.visibility / 1000).toFixed(1)} km</p>
                </div>
            </div>
        `;
    }

    function displayForecast(forecastData) {
        if (!forecastData || forecastData.length === 0) {
            elements.forecastResult.innerHTML = '<p class="error">No forecast data available</p>';
            return;
        }

        const unitSymbol = currentUnit === 'metric' ? '°C' : '°F';
        
        let forecastHTML = '';
        
        forecastData.forEach(day => {
            const date = new Date(day.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            forecastHTML += `
                <div class="forecast-day">
                    <div class="forecast-date">${dayName}</div>
                    <img src="${config.iconUrl}${day.weather[0].icon}.png" 
                         alt="${day.weather[0].description}">
                    <div class="forecast-temp">
                        <span class="max-temp">${Math.round(day.main.temp_max)}${unitSymbol}</span>
                        <span class="min-temp">${Math.round(day.main.temp_min)}${unitSymbol}</span>
                    </div>
                </div>
            `;
        });
        
        elements.forecastResult.innerHTML = forecastHTML;
    }

    function toggleTemperatureUnit() {
        currentUnit = elements.unitToggle.checked ? 'imperial' : 'metric';
        if (elements.cityInput.value.trim()) {
            handleSearch(new Event('submit'));
        }
    }

    // Helper Functions
    function showLoading(show) {
        elements.loadingIndicator.style.display = show ? 'block' : 'none';
    }

    function showError(message) {
        elements.weatherResult.innerHTML = `<p class="error">${message}</p>`;
        elements.forecastResult.innerHTML = '';
    }

    function capitalizeFirstLetter(string) {
        return string.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    // Initialize with default city
    elements.cityInput.value = 'London';
    handleSearch(new Event('submit'));
});
