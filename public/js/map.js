let mapToken= `<%= process.env.MAPBOX_API_KEY %>`;

mapboxgl.accessToken = mapBoxToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

console.log(listing.coordinates);
const marker=new mapboxgl
.Marker({color:"red"})
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset:25}).setHTML(`<h3>${listing.location}</h3>`))
.addTo(map);