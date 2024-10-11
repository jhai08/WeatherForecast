const API_KEY = 'b1874e8463abeeb77801729dc9ce5eac';
const CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const GEOCODE_URL = 'http://api.openweathermap.org/geo/1.0/direct';

let chartInstance;
let map;
let marker;
let tempNewLayer; // New layer for temperature map

// Function to get latitude and longitude using the Geolocation API
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                console.log(`User's location: Latitude: ${latitude}, Longitude: ${longitude}`);
                await getWeatherByCoordinates(latitude, longitude);
                initMap(latitude, longitude);
            },
            (error) => {
                console.error('Error getting user location:', error.message);
                alert('Unable to retrieve your location. Please enter a city name instead.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser. Please enter a city name.');
    }
}

// Function to get weather data using coordinates
async function getWeatherByCoordinates(lat, lon) {
    const currentWeatherUrl = `${CURRENT_WEATHER_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    try {
        const response = await fetch(currentWeatherUrl);
        if (!response.ok) throw new Error(`Error: ${response.status} - ${response.statusText}`);
        const data = await response.json();
        displayCurrentWeather(data);
        await getThreeHourForecastByCity(lat, lon);
    } catch (error) {
        console.error('Error fetching weather data by coordinates:', error.message);
        alert('Failed to fetch weather data for your current location.');
    }
}

// Initialize the map with given latitude and longitude
function initMap(lat, lon) {
    if (!map) {
        // Create the map only if it doesn't already exist
        map = L.map('map').setView([lat, lon], 11);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add a marker to the user's location
        marker = L.marker([lat, lon]).addTo(map);

        // Optional: Add weather layer for visualization
        tempNewLayer = L.tileLayer(`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${API_KEY}`, {
            attribution: 'Weather data © OpenWeatherMap',
            opacity: 0.6
        }).addTo(map);
    } else {
        // Update map position if it already exists
        map.setView([lat, lon], 11);
        if (marker) {
            marker.setLatLng([lat, lon]);
        } else {
            marker = L.marker([lat, lon]).addTo(map);
        }
    }
}

// Function to get latitude and longitude from city name using OpenWeatherMap Geocoding API
async function getCoordinatesByCity(city) {
    const geocodeURL = `${GEOCODE_URL}?q=${city}&limit=5&appid=${API_KEY}`;
    try {
        const response = await fetch(geocodeURL);
        if (!response.ok) throw new Error(`Error: ${response.status} - ${response.statusText}`);
        const locations = await response.json();
        if (locations && locations.length > 0) {
            console.log(`City: ${city} | Latitude: ${locations[0].lat}, Longitude: ${locations[0].lon}`);
            return { lat: locations[0].lat, lon: locations[0].lon };
        } else {
            throw new Error('No coordinates found for the entered city.');
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error.message);
        alert('Failed to fetch coordinates for the entered city.');
        return null;
    }
}

// Fetch current weather by city name
async function getWeatherByCity(city) {
    const currentWeatherUrl = `${CURRENT_WEATHER_URL}?q=${city}&units=metric&appid=${API_KEY}`;
    try {
        const response = await fetch(currentWeatherUrl);
        if (!response.ok) throw new Error(`Error: ${response.status} - ${response.statusText}`);
        const data = await response.json();
        displayCurrentWeather(data);
        const { lat, lon } = data.coord;
        await getThreeHourForecastByCity(lat, lon);
        initMap(lat, lon);
    } catch (error) {
        console.error('Error fetching weather data by city:', error.message);
        alert('Failed to fetch weather data for the entered city.');
    }
}

// Display current weather information
function displayCurrentWeather(data) {
    const cityName = data.name;
    const countryName = data.sys.country;
    const currentTemp = data.main.temp;
    const weatherDescription = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    document.getElementById('currentWeather').innerHTML = `
        <h3>${cityName}, ${countryName}</h3>
        <img src="${icon}" alt="Weather Icon">
        <p>Temperature: ${currentTemp}°C</p>
        <p>Weather: ${weatherDescription}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;
}

// Fetch and display 3-hour forecast data
async function getThreeHourForecastByCity(lat, lon) {
    const url = `${FORECAST_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error: ${response.status} - ${response.statusText}`);
        const data = await response.json();
        
        if (data && data.list && data.list.length > 0) {
            displayThreeHourForecast(data);
            plotHourlyGraph(data.list);
        } else {
            throw new Error('No valid forecast data received.');
        }
    } catch (error) {
        console.error('Error fetching 3-hour forecast data:', error.message);
        alert('Failed to fetch 3-hour forecast data.');
    }
}

// Display 3-hour forecast (first 6 entries)
function displayThreeHourForecast(data) {
    let forecastHTML = `
        <table class="forecast-table">
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Temperature</th>
                    <th>Weather</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for (let i = 0; i < 6; i++) {
        const forecast = data.list[i];
        const date = new Date(forecast.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const temp = `${forecast.main.temp}°C`;
        const weather = forecast.weather[0].description;
        const icon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

        forecastHTML += `
            <tr>
                <td>${date}</td>
                <td>${temp}</td>
                <td><img src="${icon}" alt="Weather Icon" class="forecast-icon"> ${weather}</td>
            </tr>
        `;
    }

    forecastHTML += `
            </tbody>
        </table>
    `;

    document.getElementById('hourlyForecast').innerHTML = forecastHTML;
}

// Plot hourly forecast on a graph
function plotHourlyGraph(data) {
    const ctx = document.getElementById('forecastGraph').getContext('2d');
    const times = data.slice(0, 6).map(forecast => new Date(forecast.dt * 1000).toLocaleTimeString());
    const temps = data.slice(0, 6).map(forecast => forecast.main.temp);

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: 'Temperature (°C)',
                data: temps,
                borderColor: 'blue',
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            }
        }
    });
}

// Event listeners for search functionality
document.getElementById('search-btn').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
        const coordinates = await getCoordinatesByCity(city);
        if (coordinates) {
            getWeatherByCity(city);
            initMap(coordinates.lat, coordinates.lon);
        }
    } else {
        alert('Please enter a valid city name.');
    }
});

document.getElementById('cityInput').addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        const city = document.getElementById('cityInput').value.trim();
        if (city) {
            const coordinates = await getCoordinatesByCity(city);
            if (coordinates) {
                getWeatherByCity(city);
                initMap(coordinates.lat, coordinates.lon);
            }
        } else {
            alert('Please enter a valid city name.');
        }
    }
});

// Call getUserLocation on page load to get weather data for user's location
window.addEventListener('load', getUserLocation);
