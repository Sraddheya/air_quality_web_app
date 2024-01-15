const apiUrlAirQuality = 'https://airquality.googleapis.com/v1/currentConditions:lookup?';
const apiUrlGeocoding = 'https://maps.googleapis.com/maps/api/geocode/json?';
const apiKey = YOURKEY;

let airInfo = {
  aqiLevel: 0,
  color: "",
  recGeneral: "",
  location: {
    "latitude": 0,
    "longitude": 0
  }
}

//Set default city
document.addEventListener("DOMContentLoaded", function() {
  const defaultCity = "London";
  document.querySelector('.search-input').value = defaultCity;
  getGeocodeData();
});

//Get geocode data
async function getGeocodeData() {
    const address = document.querySelector('.search-input').value;
    console.log(address);

    try {
        const response = await fetch(apiUrlGeocoding + `address=${encodeURIComponent(address)}&key=${apiKey}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();

      if (data.results.length > 0) {
        const location = data.results[0].geometry.location;
        airInfo.location.latitude = location.lat
        airInfo.location.longitude = location.lng
        console.log(airInfo.location)
        document.querySelector('.location-text').innerText = address
        fetchAirQuality();
      }
  
    } catch (error) {
      console.error('Error fetching geocoding data:', error);
    }
  }

//Fetch air quality data
async function fetchAirQuality(){
    try {
        const requestData = {
            universalAqi: true,
            location: airInfo.location,
            extraComputations: [
              "HEALTH_RECOMMENDATIONS"
            ],
            languageCode: "en"
          };

        const response = await fetch(apiUrlAirQuality + `key=${apiKey}`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData),
          });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        airInfo.aqiLevel = data.indexes[0].aqi
        console.log(airInfo.aqiLevel)
        airInfo.color = data.indexes[0].color
        airInfo.recGeneral = data.healthRecommendations.generalPopulation
        console.log('AirQuality Data:', data);
        console.log('airInfo:', airInfo);
        document.querySelector('.aqi-text').innerText = airInfo.aqiLevel
        document.querySelector('.general-rec').innerText = airInfo.recGeneral
        setProgressBar();
    } catch (error) {
        console.error('Error fetching air quality data', error);
    }
}

function setProgressBar(){
  const progressBar = document.querySelector(".circular-progress");
  const progressValue = progressBar.querySelector(".percentage");
  const innerCircle = progressBar.querySelector(".inner-circle");
  let startValue = 0,
    endValue = airInfo.aqiLevel,
    speed = 50,
    progressColor = "crimson";

  const progress = setInterval(() => {
    startValue++;
    progressValue.textContent = `${startValue}%`;
    progressValue.style.color = `${progressColor}`;
    console.log(endValue)

    innerCircle.style.backgroundColor = `${progressBar.getAttribute(
      "white"
    )}`;

    progressBar.style.background = `conic-gradient(${progressColor} ${
      startValue * 3.6
    }deg,black 0deg)`;
    if (startValue === endValue) {
      clearInterval(progress);
    }
  }, speed);
}