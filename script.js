const API_KEY = 'b1874e8463abeeb77801729dc9ce5eac'; // Your OpenWeatherMap API key
const CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

let chartInstance; // Variable to store the chart instance

// Fetch current weather by city name
async function getWeatherByCity(city) {
    const currentWeatherUrl = `${CURRENT_WEATHER_URL}?q=${city}&units=metric&appid=${API_KEY}`;
    try {
        const response = await fetch(currentWeatherUrl);
        if (!response.ok) throw new Error(`Error: ${response.status} - ${response.statusText}`);
        const data = await response.json();
        displayCurrentWeather(data);
        const { lat, lon } = data.coord;
        await getThreeHourForecastByCity(lat, lon); // Fetch 3-hour forecast using latitude and longitude
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
            displayThreeHourForecast(data); // Display 3-hour forecast
            plotHourlyGraph(data.list); // Plot the graph
        } else {
            throw new Error('No valid forecast data received.');
        }
    } catch (error) {
        console.error('Error fetching 3-hour forecast data:', error.message);
        alert('Failed to fetch 3-hour forecast data.');
    }
}

// Display 3-hour forecast (first 4 entries)
function displayThreeHourForecast(data) {
    let forecastHTML = '';
    for (let i = 0; i < 4; i++) {
        const forecast = data.list[i];
        const date = new Date(forecast.dt * 1000).toLocaleString();
        forecastHTML += `
            <div class="hourly-forecast">
                <p>Time: ${date}, Temp: ${forecast.main.temp}°C</p>
                <p>Weather: ${forecast.weather[0].description}</p>
                <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="Weather Icon">
            </div>
        `;
    }
    document.getElementById('hourlyForecast').innerHTML = forecastHTML;
}

// Plot hourly forecast on a graph
function plotHourlyGraph(data) {
    const ctx = document.getElementById('forecastGraph').getContext('2d');
    const times = data.slice(0, 4).map(forecast => new Date(forecast.dt * 1000).toLocaleTimeString()); // First 4 intervals
    const temps = data.slice(0, 4).map(forecast => forecast.main.temp);

    // Destroy the previous chart instance if it exists to avoid overlap
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
                tension: 0.1 // Smooth the line
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

document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value.trim();
    if (city) getWeatherByCity(city);
    else alert('Please enter a valid city name.');
});

document.getElementById('cityInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const city = document.getElementById('cityInput').value.trim();
        if (city) getWeatherByCity(city);
        else alert('Please enter a valid city name.');
    }
});
