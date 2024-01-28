// URL of the earthquake JSON file
const jsonUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Initialize the Leaflet map
var map = L.map('map').setView([0, 0], 2); 

// Add a default OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Fetch earthquake data
fetch(jsonUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status code: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Once data is fetched, add earthquake markers to the map
    addEarthquakeMarkers(data);
    // Add legend
    addLegend();
  })
  .catch(error => {
    console.error(error);
  });

// Function to add earthquake markers to the Leaflet map
function addEarthquakeMarkers(data) {
  // Define a function to calculate marker size based on magnitude
  function calculateMarkerSize(magnitude) {
    return magnitude * 5; 
  }

  // Define a function to calculate marker color based on depth
  function calculateMarkerColor(depth) {
    // Use a color scale 
    return depth > 100 ? '#ff4500' : '#32cd32'; 
  }

  // Iterate through the data and add markers to the map
  data.features.forEach(feature => {
    const coordinates = feature.geometry.coordinates;
    const magnitude = feature.properties.mag;
    const depth = coordinates[2];

    const marker = L.circleMarker([coordinates[1], coordinates[0]], {
      radius: calculateMarkerSize(magnitude),
      fillColor: calculateMarkerColor(depth),
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(map);

    // Add popup with earthquake information
    marker.bindPopup(`<b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth} km`);
  });
}

// Function to add legend to the map
function addLegend() {
  const legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'info legend');
    const grades = [0, 100]; 

    for (let i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + calculateMarkerColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(map);
}
