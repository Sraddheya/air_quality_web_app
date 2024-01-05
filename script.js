const apiUrlAirQuality = 'https://airquality.googleapis.com/v1/currentConditions:lookup?';
const apiUrlGeocoding = 'https://maps.googleapis.com/maps/api/geocode/json?';
const apiKey = YOURKEY;

//Default location London
let locationData = {
    "latitude": 51.5072178,
    "longitude": -0.1275862
};

fetchAirQuality();
document.querySelector('.location-text').innerText = "London"

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
        locationData.latitude = location.lat;
        locationData.longitude = location.lng;
        console.log(locationData);
        document.querySelector('.location-text').innerText = address
        fetchAirQuality();
      }
  
    } catch (error) {
      console.error('Error fetching geocoding data:', error);
    }
  }


async function fetchAirQuality(){
    try {
        const requestData = {
            universalAqi: true,
            location: locationData,
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

        console.log('AirQuality Data:', data);
        document.querySelector('.aqi-text').innerText = data.indexes[0].aqi
        document.querySelector('.general-rec').innerText = data.healthRecommendations.generalPopulation
        // document.querySelector('.elderly-rec').innerText = data.healthRecommendations.elderly
        // document.querySelector('.children-rec').innerText = data.healthRecommendations.children
    } catch (error) {
        console.error('Error fetching air quality data', error);
    }
}

const circularProgress = document.querySelectorAll(".circular-progress");

Array.from(circularProgress).forEach((progressBar) => {
  const progressValue = progressBar.querySelector(".percentage");
  const innerCircle = progressBar.querySelector(".inner-circle");
  let startValue = 0,
    endValue = Number(progressBar.getAttribute("data-percentage")),
    speed = 50,
    progressColor = progressBar.getAttribute("data-progress-color");

  const progress = setInterval(() => {
    startValue++;
    progressValue.textContent = `${startValue}%`;
    progressValue.style.color = `${progressColor}`;

    innerCircle.style.backgroundColor = `${progressBar.getAttribute(
      "data-inner-circle-color"
    )}`;

    progressBar.style.background = `conic-gradient(${progressColor} ${
      startValue * 3.6
    }deg,${progressBar.getAttribute("data-bg-color")} 0deg)`;
    if (startValue === endValue) {
      clearInterval(progress);
    }
  }, speed);
});