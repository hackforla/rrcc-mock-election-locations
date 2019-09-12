/* global $ */
/* global L */

const SHOW_WARNINGS = false;
const warningString = ''; /* Warning Log */
const participantList = ''; /* List of participants */

/*
 * Initialize Map
 */
L.mapbox.accessToken =
  'pk.eyJ1IjoibWF0aWtpbjkiLCJhIjoiYjMyMjBjZTE4NWUxMDkxOWZjZjFjZWEzZTcxNDUxOTkifQ._ldFl3e17jCs7aWm6zMZ3Q';
const mymap = L.map('map').setView([34.0522, -118.2437], 9);
L.mapbox
  .styleLayer('mapbox://styles/matikin9/cim5bt1q100iy9jkpl7ff9d1h')
  .addTo(mymap); // base layer

const overlayMaps = {};

/*
 * Pull data and display on page
 */
$(function() {
  getGoogleSheetData();
  L.control.layers(overlayMaps).addTo(mymap);
});

function getGoogleSheetData() {
  /*
    https://spreadsheets.google.com/feeds/worksheets/1OsMJUGcDA5HzP1ymc6vSXQ9XFb5OnSrvfm2rBFrI2Ng/public/basic?alt=json
    https://spreadsheets.google.com/feeds/list/1OsMJUGcDA5HzP1ymc6vSXQ9XFb5OnSrvfm2rBFrI2Ng/ob55q1q/public/values?alt=json
    */

  const spreadsheetID = '1OsMJUGcDA5HzP1ymc6vSXQ9XFb5OnSrvfm2rBFrI2Ng';
  const worksheetID = 'ob55q1q'; // Sheet 1: orfa4yj
  const url = `https://spreadsheets.google.com/feeds/list/${spreadsheetID}/${worksheetID}/public/values?alt=json`;

  /*
   * Iterate through each
   * participant's submission.
   */
  $.getJSON(url, function(data) {
    $.each(data.feed.entry, function(i, val) {
      displayOnPage(val);
    });
  });

  // Log Warnings
  if (SHOW_WARNINGS) {
    $('#main-content').append(
      `<strong>Warnings: </strong><br>${
        warningString == '' ? 'No errors!' : warningString
      }<br><br>`
    );
  }
}

function displayOnPage(row, warningString) {
  let name = '';
  if (row.gsx$name.$t === '') {
    name = 'anonymous';
  } else {
    name = row.gsx$name.$t;
  }

  const name_slug = name.replace(/\s+/g, '');
  const markers = [];

  /*
   * Add marker for each location
   * provided by participant.
   */
  for (let i = 1; i < 5; i++) {
    const lat = row[`gsx$location${i}lat`].$t;
    const lng = row[`gsx$location${i}lng`].$t;
    const locationName = row[`gsx$location${i}name`].$t;
    const description = row[`gsx$location${i}description`].$t;

    if (lat == '' || lng == '') {
      warningString += `${name} has no coordinates for Location ${i}.<br>`;
    } else {
      const $locationInfo = $('<div>', {
        // "id": name_slug + i,
        class: 'location-data ', // + name_slug + "-marker"
      });

      // Build popup window
      $locationInfo.append(`<h1>${locationName}</h1>`);
      $locationInfo.append(`<em>${name}</em><br><br>`);
      $locationInfo.append(`<p>${description}</p>`);

      const m = L.marker([lat, lng])
        .on('click', onMarkerClick)
        .bindPopup($locationInfo[0])
        .addTo(mymap);

      markers.push(m);
    }

    overlayMaps[name_slug] = L.layerGroup(markers);
  }

  /*
   * Add list entry for each participant
   * so that when their name is clicked,
   * their markers are highlighted.
   */
  const $participant = $('<a>', {
    href: '#',
  });

  $participant.append(name);
  $participant.click(function() {});
}

function onMarkerClick(e) {
  const popup = e.target.getPopup();
  const content = popup.getContent();
  $('#location-detail').html(content.innerHTML);
  event.target.closePopup();
}
