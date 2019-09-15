/* global $ */
/* global L */

const SHOW_WARNINGS = false;
const warningString = ""; /* Warning Log */
const participantList = ""; /* List of participants */

const overlayMaps = {};

/*
 * Initialize Map
  Instructions:
  -Insert Access token
  -Insert style Layer
 */

L.mapbox.accessToken =
  "pk.eyJ1IjoidGFiYXRhaGciLCJhIjoiY2swZ3d0ZW1tMGNhZDNtbnhuMjl1dWdtaSJ9.QE_hNeGWFEqBI1JFHIR4hQ";
const myMap = L.map("map").setView([34.0522, -118.2437], 9);
L.mapbox
  .styleLayer("mapbox://styles/tabatahg/ck0gwuq7217531cnymp56kn0u")
  .addTo(myMap); // base layer

function getJSONData() {
  $.getJSON("../mock-election-locations.json", function(data) {
    $.each(data, function(i, val) {
      displayOnPage(val);
    });
    if (SHOW_WARNINGS) {
      $("#main-content").append(
        `<strong>Warnings: </strong><br>${
          warningString == "" ? "No errors!" : warningString
        }<br><br>`
      );
    }
  });
}

/*
 * Pull data and display on page
 */
$(function() {
  getJSONData();
  L.control.layers(overlayMaps).addTo(myMap);
});

// function getGoogleSheetData() {
//   /*
//     https://spreadsheets.google.com/feeds/worksheets/1OsMJUGcDA5HzP1ymc6vSXQ9XFb5OnSrvfm2rBFrI2Ng/public/basic?alt=json
//     https://spreadsheets.google.com/feeds/list/1OsMJUGcDA5HzP1ymc6vSXQ9XFb5OnSrvfm2rBFrI2Ng/ob55q1q/public/values?alt=json
//     */

//   const spreadsheetID = "1OsMJUGcDA5HzP1ymc6vSXQ9XFb5OnSrvfm2rBFrI2Ng";
//   const worksheetID = "ob55q1q"; // Sheet 1: orfa4yj
//   const url = `https://spreadsheets.google.com/feeds/list/${spreadsheetID}/${worksheetID}/public/values?alt=json`;

//   /*
//    * Iterate through each
//    * participant's submission.
//    */
//   $.getJSON(url, function(data) {
//     $.each(data.feed.entry, function(i, val) {
//       displayOnPage(val);
//     });
//   });

//   Log Warnings
//   if (SHOW_WARNINGS) {
//     $("#main-content").append(
//       `<strong>Warnings: </strong><br>${
//         warningString == "" ? "No errors!" : warningString
//       }<br><br>`
//     );
//   }
// }

function displayOnPage(location, warningString) {
  let name = "";
  if (location.LocationName === "") {
    name = "anonymous";
  } else {
    name = location.LocationName;
  }

  const name_slug = name.replace(/\s+/g, "");
  const markers = [];

  /*
   * Add marker for each location
   * provided by participant.
   */
  const lat = location["Latitude"];
  const lng = location["Longitude"];
  const locationName = location["LocationName"];
  const address = location["Address"];

  if (lat == "" || lng == "") {
    warningString += `${name} has no coordinates for Location ${
      location["LocationName"]
    }.<br>`;
  } else {
    const $locationInfo = $("<div>", {
      // "id": name_slug + i,
      class: "location-data " // + name_slug + "-marker"
    });

    // Build popup window
    $locationInfo.append(`<h1>${locationName}</h1>`);
    $locationInfo.append(`<h3>${address}</h3>`);

    const marker = L.marker([lat, lng])
      .on("click", onMarkerClick)
      .bindPopup($locationInfo[0])
      .addTo(myMap);

    markers.push(marker);
  }

  overlayMaps[name_slug] = L.layerGroup(markers);

  /*
   * Add list entry for each participant
   * so that when their name is clicked,
   * their markers are highlighted.
   */
  const $participant = $("<a>", {
    href: "#"
  });

  $participant.append(name);
  $participant.click(function() {});
}

function onMarkerClick(e) {
  const popup = e.target.getPopup();
  const content = popup.getContent();
  $("#location-detail").html(content.innerHTML);
  event.target.closePopup();
}
