const apiUrlAirQuality = 'https://airquality.googleapis.com/v1/currentConditions:lookup?';
const apiUrlGeocoding = 'https://maps.googleapis.com/maps/api/geocode/json?';
const apiUrlStaticMap = 'https://maps.googleapis.com/maps/api/staticmap?'
const apiKey = 'AIzaSyBNYAzDpYkqO4uIccQwW_ZWHm6DwK5Ci2I';

let airInfo = {
  aqiLevel: 0,
  color: "",
  recGeneral: "",
  recFurther: "",
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
        setMapBackground();
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
        airInfo.recFurther = data.healthRecommendations.elderly
        console.log('AirQuality Data:', data);
        console.log('airInfo:', airInfo);
        //document.querySelector('.aqi-text').innerText = airInfo.aqiLevel
        document.querySelector('.general-rec').innerText = `General population: ${airInfo.recGeneral}`
        // document.querySelector('.further-rec').innerText = `Further: ${airInfo.recFurther}`
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
    progressValue.textContent = `${startValue}`;
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

//Limations on google maps sizes
async function setMapBackground(){
  try {
    //document.body.style.backgroundImage = `url('${apiUrlStaticMap}center=${airInfo.location.latitude}, ${airInfo.location.longitude}&zoom=9&size=${window.innerWidth}x${window.innerHeight}&scale=2&key=${apiKey}')`;
    //style=feature:road.highway%7Celement:geometry%7Cvisibility:simplified%7Ccolor:0xc280e9&style=feature:transit.line%7Cvisibility:simplified%7Ccolor:0xbababa&style=feature:road.highway%7Celement:labels.text.stroke%7Cvisibility:on%7Ccolor:0xb06eba&style=feature:road.highway%7Celement:labels.text.fill%7Cvisibility:on%7Ccolor:0xffffff
    // [
    //   {
    //     "featureType": "all",
    //     "stylers": [
    //       { "color": "#C0C0C0" }
    //     ]
    
    //style=featureType:all%7Ccolor:#C0C0C0
    
    //https://maps.googleapis.com/maps/api/staticmap?key=YOUR_API_KEY&center=47.65,-122.35&zoom=12&format=png&maptype=roadmap&style=element:geometry%7Ccolor:0xf5f5f5&style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x616161&style=element:labels.text.stroke%7Ccolor:0xf5f5f5&style=feature:administrative.land_parcel%7Celement:labels%7Cvisibility:off&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xbdbdbd&style=feature:poi%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:poi%7Celement:labels.text%7Cvisibility:off&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:poi.business%7Cvisibility:off&style=feature:poi.park%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:poi.park%7Celement:labels.text%7Cvisibility:off&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:road%7Celement:geometry%7Ccolor:0xffffff&style=feature:road.arterial%7Celement:labels%7Cvisibility:off&style=feature:road.arterial%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:road.highway%7Celement:geometry%7Ccolor:0xdadada&style=feature:road.highway%7Celement:labels%7Cvisibility:off&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:road.local%7Cvisibility:off&style=feature:road.local%7Celement:labels%7Cvisibility:off&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:transit.line%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:transit.station%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:water%7Celement:geometry%7Ccolor:0xc9c9c9&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&size=480x360
   
    style = "element:geometry%7Ccolor:0x212121&style=element:labels%7Cvisibility:off&style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x757575&style=element:labels.text.stroke%7Ccolor:0x212121&style=feature:administrative%7Celement:geometry%7Ccolor:0x757575&style=feature:administrative.country%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:administrative.land_parcel%7Cvisibility:off&style=feature:administrative.locality%7Celement:labels.text.fill%7Ccolor:0xbdbdbd&style=feature:administrative.neighborhood%7Cvisibility:off&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:poi.park%7Celement:geometry%7Ccolor:0x181818&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:poi.park%7Celement:labels.text.stroke%7Ccolor:0x1b1b1b&style=feature:road%7Celement:geometry.fill%7Ccolor:0x2c2c2c&style=feature:road%7Celement:labels.text.fill%7Ccolor:0x8a8a8a&style=feature:road.arterial%7Celement:geometry%7Ccolor:0x373737&style=feature:road.highway%7Celement:geometry%7Ccolor:0x3c3c3c&style=feature:road.highway.controlled_access%7Celement:geometry%7Ccolor:0x4e4e4e&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:transit%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:water%7Celement:geometry%7Ccolor:0x000000&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x3d3d3d";
    document.body.style.backgroundImage = `url('${apiUrlStaticMap}center=${airInfo.location.latitude}, ${airInfo.location.longitude}&zoom=10&size=640x340&scale=2&style=${style}&key=${apiKey}')`;
    console.log(window.innerWidth + " " + window.innerHeight)
  } catch (error) {
    console.error('Error setting map background', error);
  }
}