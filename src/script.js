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
        const weatherDescription = data.weather[0].description;
        const temperature = Math.round(data.main.temp - 273.15); // Convert Kelvin to Celsius
        const iconCode = data.weather[0].icon;
        const country = data.sys.country;

            const resultContainer = document.getElementById('result');
            resultContainer.innerHTML = ''; // Clear previous content

            // Create elements for result layout
            const cityElement = document.createElement('p');
            cityElement.textContent = `City: ${city}, ${country}`;

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = `Weather: ${weatherDescription}`;

            const temperatureElement = document.createElement('p');
            temperatureElement.textContent = `Temperature: ${temperature}°C`;

            // Create an element for the weather icon
            const iconElement = document.createElement('i');
            
            // Set the class based on the icon code
            if (iconCode.startsWith('01')) {
                // Clear sky
                iconElement.className = 'wi wi-day-sunny';
            } else if (iconCode.startsWith('02')) {
                // Few clouds
                iconElement.className = 'wi wi-day-cloudy';
            } else if (iconCode.startsWith('03') || iconCode.startsWith('04')) {
                // Cloudy
                iconElement.className = 'wi wi-cloudy';
            } else if (iconCode.startsWith('09')) {
                // Showers
                iconElement.className = 'wi wi-showers';
            } else if (iconCode.startsWith('10')) {
                // Rain
                iconElement.className = 'wi wi-rain';
            } else if (iconCode.startsWith('11')) {
                // Thunderstorm
                iconElement.className = 'wi wi-thunderstorm';
            } else if (iconCode.startsWith('13')) {
                // Snow
                iconElement.className = 'wi wi-snow';
            } else if (iconCode.startsWith('50')) {
                // Mist or fog
                iconElement.className = 'wi wi-fog';
            } else {
                // Default to a generic icon
                iconElement.className = 'wi wi-day-sunny-overcast';
            }

            //  Edit sizes & layout
            iconElement.classList.add('text-5xl', 'mt-10');
            cityElement.classList.add('text-2xl', 'mt-7');
            descriptionElement.classList.add('text-2xl', 'mt-7');
            temperatureElement.classList.add('text-2xl', 'mt-7');

            // Append elements to result container
            resultContainer.appendChild(iconElement);
            resultContainer.appendChild(cityElement);
            resultContainer.appendChild(descriptionElement);
            resultContainer.appendChild(temperatureElement);

            console.log(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('result').innerHTML = 'Error fetching weather data';
        });
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
        const cityData = data.geonames.map(city => ({
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

async function getData() {
    try {
      const [apiKey, weatherData] = await Promise.all([getApiKey(), getWeather()]);
      // Handle apiKey and weatherData as needed
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }