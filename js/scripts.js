/* global $ */
/* global L */

L.mapbox.accessToken =
  "pk.eyJ1IjoidGFiYXRhaGciLCJhIjoiY2swZ3d0ZW1tMGNhZDNtbnhuMjl1dWdtaSJ9.QE_hNeGWFEqBI1JFHIR4hQ";
const myMap = L.map("map").setView([34.0522, -118.2437], 9);
L.mapbox
  .styleLayer("mapbox://styles/tabatahg/ck0gwuq7217531cnymp56kn0u")
  .addTo(myMap); // base layer

$(function() {
  getJSONData();
});

function getJSONData() {
  $.getJSON("mock-election-locations.json", function(data) {
    $.each(data, function(i, val) {
      displayOnPage(val);
    });
  });
}

function displayOnPage(location, warningString) {
  const lat = location["Latitude"];
  const lng = location["Longitude"];
  const locationName = location["LocationName"];
  const address = location["Address"];

  const $locationInfo = $("<div>", {
    class: "location-data "
  });

  // Build popup window
  $locationInfo.append(`<h1>${locationName}</h1>`);
  $locationInfo.append(`<h3>${address}</h3>`);

  const marker = L.marker([lat, lng])
    .on("click", onMarkerClick)
    .bindPopup($locationInfo[0])
    .addTo(myMap);
}

function onMarkerClick(e) {
  const popup = e.target.getPopup();
  const content = popup.getContent();
  $("#location-detail").html(content.innerHTML);
  e.target.closePopup(); // prevents pop-up from appearing on the map because it displays on the side instead
}
