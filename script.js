var map = L.map('map').setView([40, -60], 3);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


function getRandomInRange(from, to, fixed) {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

const coordinates = [
  { lat: getRandomInRange(30, 35, 3), lng: getRandomInRange(-90, -100, 3) },
  { lat: getRandomInRange(30, 35, 3), lng: getRandomInRange(-90, -100, 3) },
  { lat: getRandomInRange(30, 35, 3), lng: getRandomInRange(-90, -100, 3) }
];

coordinates.forEach((coord, index) => {
  const marker = L.marker([coord.lat, coord.lng]).addTo(map);

  fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coord.lat}&longitude=${coord.lng}&localityLanguage=en`)
    .then(response => response.json())
    .then(data => {
      const locality = data.locality || 'Unknown location';
      
      const markerDesc = document.getElementById(`marker${index + 1}-desc`);
      markerDesc.innerHTML = `
        <h2>Marker ${index + 1}: Latitude (${coord.lat}), Longitude (${coord.lng})</h2>
        <h4>Location: ${locality}</h4>
      `;

      marker.bindPopup(`<b>Marker ${index + 1}</b><br>${locality}`).openPopup();
    })
    .catch(error => {
      console.error('Error fetching locality:', error);
      const markerDesc = document.getElementById(`marker${index + 1}-desc`);
      markerDesc.innerHTML = `
        <h2>Marker ${index + 1}: Latitude (${coord.lat}), Longitude (${coord.lng})</h2>
        <h4>Location: Error fetching locality</h4>
      `;
    });
});

const bounds = L.latLngBounds(coordinates.map(coord => [coord.lat, coord.lng]));
map.fitBounds(bounds);
