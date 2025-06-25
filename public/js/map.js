
	mapboxgl.accessToken =accesstoken ;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });
    
      const popup = new mapboxgl.Popup({ offset: 25 }).setText(
        'Exact location will be provided after booking.'
    );

const marker = new mapboxgl.Marker({color:"red"})
        .setLngLat(coordinates)
         .setPopup(popup)
        .addTo(map);