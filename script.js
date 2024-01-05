const apiUrlAirQuality = 'https://airquality.googleapis.com/v1/currentConditions:lookup?';
const apiUrlGeocoding = 'https://maps.googleapis.com/maps/api/geocode/json?';
const apiKey = YOURKEY;


let locationData = {
    "latitude": null,
    "longitude": null
};

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
        document.querySelector('.elderly-rec').innerText = data.healthRecommendations.elderly
        document.querySelector('.children-rec').innerText = data.healthRecommendations.children
    } catch (error) {
        console.error('Error fetching air quality data', error);
    }
}