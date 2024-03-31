// Bringing in the Geojson Data & creating the initial map and tile layer
function createMap(quakeLocations) {
  let baseMap = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  var map = L.map("map", {
    center: [37.0902, -95.7129],
    zoom: 4,
    layers: [baseMap, quakeLocations],
  });

  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let limits = [-10, 10, 30, 50, 70, 90];
    let colors = [
      "#1a9850",
      "#91cf60",
      "#d9ef8b",
      "#fee08b",
      "#fc8d59",
      "#d73027",
    ];
    let labels = [];
    div.innerHTML =
      "<div class='labels'>" +
      "<div class='label'>-10 - 10</div>" +
      "<div class='label'>10 - 30</div>" +
      "<div class='label'>30 - 50</div>" +
      "<div class='label'>50 - 70</div>" +
      "<div class='label'>70 - 90</div>" +
      "<div class='label'>90+</div>" +
      "</div>";
    limits.forEach(function (limit, index) {
      labels.push('<li style="background-color: ' + colors[index] + '"></li>');
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };
  legend.addTo(map);
}

function quakeColor(depth) {
  let color;
  if (parseInt(depth) <= 10) {
    color = "#1a9850";
  } else if (parseInt(depth) <= 30) {
    color = "#91cf60";
  } else if (parseInt(depth) <= 50) {
    color = "#d9ef8b";
  } else if (parseInt(depth) <= 70) {
    color = "#fee08b";
  } else if (parseInt(depth) <= 90) {
    color = "#fc8d59";
  } else {
    color = "#d73027";
  }
  return color;
}

function createMarkers(response) {
  let quakes = response.features;
  let quakeMarkers = [];

  for (let index = 0; index < quakes.length; index++) {
    let quake = quakes[index];
    let magnitude = quake.properties.mag;

    let quakeMarker = L.circle(
      [quake.geometry.coordinates[1], quake.geometry.coordinates[0]],
      {
        radius: magnitude * 10000,
        color: quakeColor(quake.geometry.coordinates[2]),
        weight: 0.75,
        fillColor: quakeColor(quake.geometry.coordinates[2]),
        fillOpacity: 0.5,
      }
    ).bindPopup(`<h3>${quake.properties.title}</h3>
        <h4>Date & Time: ${new Date(quake.properties.time)}</h4>
        <h4>Depth: ${magnitude}</h4>`);

    quakeMarkers.push(quakeMarker);
    // console.log(quakeMarkers)
  }
  createMap(L.layerGroup(quakeMarkers));
}

d3.json(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"
).then(createMarkers);
