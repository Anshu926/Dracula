
  const MAP_TOKEN = mapToken;
	mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: "map", // container ID
        center: list.geometry.coordinates,
        style : "mapbox://styles/mapbox/streets-v12",
         // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 8 // starting zoom
    });
  const marker = new mapboxgl.Marker({color : 'red'})
    .setLngLat(list.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset : 25}).setHTML(`<h4><b>${list.title}</b></h4><p>Exact location will beprovided after booking !!</p>`))
    .addTo(map);
