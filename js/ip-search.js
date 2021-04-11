// Get IPify API credentials
const endpoint = "https://geo.ipify.org/api/v1";
const apiKey = API_KEY;
// Leaflet.js map variables
const myIcon = L.icon({
  iconUrl: "./images/icon-location.svg",
  iconSize: [46, 55],
  iconAnchor: [23, 55],
});
let myMap;

/*
 * FUNCTIONS
 */

// PERFORM AN IP LOOKUP
function ipLookup(query) {
  // Remove any error styling that may be present
  $("#search-bar input").removeClass("error");
  // Create the endpoint url
  let searchEndpoint = endpoint + "?apiKey=" + apiKey;

  if (query) {
    if ($.isNumeric(query)) {
      searchEndpoint += "&ipAddress=" + query;
    } else {
      searchEndpoint += "&domain=" + query;
    }
  }
  // Make the API call
  $.ajax({
    url: searchEndpoint,
    dataType: "json",
    success: function (data) {
      // console.log(data);
      popDisplay(data);
      popMap(data);
    },
  });
}

// TRIGGERED ON SUBMIT
function search() {
  let query = $("#input").val();
  ipLookup(query);
}

// POPULATE THE RESULTS DISPLAY
function popDisplay(results) {
  $("#ip").text(results.ip);
  $("#location").text(
    results.location.city +
      ", " +
      results.location.region +
      " " +
      results.location.postalCode
  );
  $("#timezone").text("UTC " + results.location.timezone);
  $("#isp").text(results.isp);
}

// POPULATE THE MAP
function popMap(results) {
  // Use the lat/long from the API response, set zoom
  myMap.setView([results.location.lat, results.location.lng], 13);
  // Add the visual layer from mapbox
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: ACCESS_TOKEN,
    }
  ).addTo(myMap);
  // Add the custom position marker
  L.marker([results.location.lat, results.location.lng], {
    icon: myIcon,
  }).addTo(myMap);
}

// SET-UP STUFF ON INITIAL PAGE LOAD
function init() {
  // Create the map
  myMap = L.map("mapid");
  // Perform the initial default search (no query)
  ipLookup();
}

// ERROR HANDLING
$(document).ajaxError(function (event, request, settings) {
  $("#search-bar input").addClass("error");
});

init();
