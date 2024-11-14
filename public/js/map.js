mapboxgl.accessToken = mapToken;

let coordinates = listing.geometry.coordinates;
console.log(coordinates);

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 12 // starting zoom
});



//  Create a default Marker and add it to the map.
 const marker = new mapboxgl.Marker({color:'red'})
 .setLngLat(coordinates)
 .setPopup(new mapboxgl.Popup({offset: 25, className: 'my-class'})
 .setHTML(`<h4>${listing.title}</h4><p>Exact location provided after booking</p>`)
 .setMaxWidth("300px"))
 .addTo(map);


