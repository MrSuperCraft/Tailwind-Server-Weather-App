const getApiKey = async () => {
    try {
      const response = await fetch('http://localhost:5500/api-key');
      const data = await response.json();
      return data.apiKey;
    } catch (error) {
      console.error('Error fetching API key:', error);
      return null;
    }
};

function createWeatherBox(...metrics) {
    const gridContainer = document.getElementById('result');

    // Create a weather box
    const weatherBox = document.createElement('div');
    weatherBox.classList.add('weather-box', 'bg-white', 'rounded-md', 'p-4', 'text-center', 'transition-transform', 'transform', 'hover:scale-105');

    metrics.forEach(([label, value, iconClass]) => {
        // Create metric element
        const metricElement = document.createElement('div');
        metricElement.classList.add('mb-4');

        // Create icon element
        const iconElement = document.createElement('i');
        // Apply Weather Icons class using classList
        iconElement.classList.add('wi', iconClass, 'text-5xl', 'mb-5');

        // Create value element
        const valueElement = document.createElement('p');
        valueElement.classList.add('text-md' , 'mt-4');
        valueElement.innerHTML = `${label}: ${value}`;

        // Append elements to the metric element
        metricElement.appendChild(iconElement);
        metricElement.appendChild(valueElement);

        // Append metric element to the weather box
        weatherBox.appendChild(metricElement);
    });

    // Append weather box to the grid container
    gridContainer.appendChild(weatherBox);
}

async function getWeather() {
    const apiKey = await getApiKey();

    if (!apiKey) {
        console.error('API key is not available');
        return;
    }

    const city = document.getElementById('city').value;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const temperature = Math.round(data.main.temp - 273.15); // Convert Kelvin to Celsius
            const iconCode = data.weather[0].icon;
            const country = data.sys.country;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;

            const resultContainer = document.getElementById('result');
            resultContainer.innerHTML = ''; // Clear previous content

            // Create weather boxes for different metrics
            createWeatherBox(['Location', `${city}, ${country}`, getWeatherIconClass(iconCode)]);
            createWeatherBox(['Wind Speed', `${windSpeed} m/s`, 'wi-strong-wind']);
            createWeatherBox(['Temperature', `${temperature}°C`, 'wi-thermometer']);
            createWeatherBox(['Humidity', `${humidity}%`, 'wi-humidity']);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('result').innerHTML = 'Error fetching weather data';
        });
}

// Function to get the Weather Icons class based on the icon code
function getWeatherIconClass(iconCode) {
    // Implement logic to map iconCode to Weather Icons class
    // For example:
    if (iconCode.startsWith('01')) {
        return 'wi-day-sunny';
    } else if (iconCode.startsWith('02')) {
        return 'wi-day-cloudy';
    } else if (iconCode.startsWith('03') || iconCode.startsWith('04')) {
        return 'wi-cloudy';
    } else if (iconCode.startsWith('09')) {
        return 'wi-showers';
    } else if (iconCode.startsWith('10')) {
        return 'wi-rain';
    } else if (iconCode.startsWith('11')) {
        return 'wi-thunderstorm';
    } else if (iconCode.startsWith('13')) {
        return 'wi-snow';
    } else if (iconCode.startsWith('50')) {
        return 'wi-fog';
    } else {
        return 'wi-day-sunny-overcast';
    }
}

async function handleInput() {
    const input = document.getElementById('city');
    const autocompleteList = document.getElementById('autocomplete-list');

    const inputValue = input.value.toLowerCase();

    // Show or hide the autocomplete list based on input value
    if (inputValue.trim() === '') {
        autocompleteList.style.display = 'none';
    } else {
        autocompleteList.style.display = 'block';

        // Fetch and display matching suggestions
        const cityData = await fetchCityData(inputValue);

        // Clear previous suggestions
        autocompleteList.innerHTML = '';

        // Display matching suggestions
        cityData.forEach(city => {
            const suggestion = document.createElement('div');
            suggestion.textContent = city.name;
            suggestion.addEventListener('click', () => {
                input.value = city.name;
                autocompleteList.style.display = 'none'; // Clear suggestions after selecting
            });
            autocompleteList.appendChild(suggestion);
        });
    }
}


// Function to fetch city data from GeoNames API
async function fetchCityData(query) {
    const username = 'MrSuperCraft'; // Replace with your GeoNames username
    const maxRows = 10; // Adjust as needed

    try {
        const response = await fetch(`http://api.geonames.org/searchJSON?q=${query}&maxRows=${maxRows}&username=${username}`);
        const data = await response.json();
        
        // Extract relevant city data
        const cityData = data.geonames
            .filter(city => city.population && city.population > 0) // Filter out entries without valid population
            .map(city => ({
                name: city.name,
                country: city.countryName,
                // Add more properties as needed
            }));

        return cityData;
    } catch (error) {
        console.error('Error fetching city data:', error);
        return []; // Return an empty array in case of an error
    }
}