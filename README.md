### README.md Content for Your Weather Dashboard

```markdown
# Weather Dashboard

## Overview
The Weather Dashboard is a web application that provides real-time weather data, including current weather conditions, a 3-hour weather forecast, and a visual representation of the forecast. It utilizes the OpenWeatherMap API and OpenStreetMap for displaying map data and location-based weather information.

## Features
- **Current Weather Data:** Displays temperature, weather description, humidity, and wind speed for the searched city.
- **3-Hour Forecast:** Provides a 3-hour weather forecast with a summary table and visual representation using a line graph.
- **Interactive Map:** Shows the location on the map based on the searched city using OpenStreetMap.
- **Geocoding Integration:** Allows users to search by city name, which is converted to latitude and longitude coordinates using the OpenWeatherMap Geocoding API.

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **APIs Used:** 
  - [OpenWeatherMap API](https://openweathermap.org/api) for weather data.
  - [OpenWeatherMap Geocoding API](https://openweathermap.org/api/geocoding-api) for converting city names to geographical coordinates.
  - [OpenStreetMap](https://www.openstreetmap.org) for interactive map visualization.

## How to Use
1. **Search for a City:**
   - Enter the city name in the search bar and click on the "Search" button or press "Enter".
   - The application will fetch and display the current weather information and a 3-hour forecast for the selected city.
   - It will also center the map on the location of the city.

2. **View Weather Information:**
   - The dashboard displays the current temperature, weather conditions, humidity, and wind speed.
   - The 3-hour forecast is shown in a table format and visualized on a graph.

3. **Interactive Map:**
   - The map displays the city location and overlays weather data using OpenStreetMap tiles.

## Setup and Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/weather-dashboard.git
   cd weather-dashboard
   ```

2. Open the `index.html` file in your preferred web browser.

3. The application will load and you can start searching for weather data by entering a city name.

## Files Structure
- **index.html:** Main HTML file containing the layout and structure of the application.
- **style.css:** CSS file for styling the application layout and components.
- **script.js:** JavaScript file containing the functionality for fetching data from APIs, displaying weather information, and managing the map.

## API Configuration
To use the application, you need to include your own OpenWeatherMap API key:
1. Sign up at [OpenWeatherMap](https://home.openweathermap.org/users/sign_up) to get your API key.
2. Replace the `API_KEY` variable in the `script.js` file with your own API key:
   ```javascript
   const API_KEY = 'your_api_key_here';
   ```
