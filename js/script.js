var data = {
	markers: [],
	places: [
		{
			title: "The Square Pub",
			location: {
				lat: 42.4241655,
				lng: 18.770965
			}
		},{
			title: "Bokeski Gusti",
			location: {
				lat: 42.460363,
				lng: 18.73907
			}
		},{
			title: "Conte",
			location: {
				lat: 42.4861,
				lng: 18.6983
			}
		},{
			title: "Al Posto Giusto",
			location: {
				lat: 42.43269,
				lng: 18.6936
			}
		},{
			title: "Forza Cafe",
			location: {
				lat: 42.42495,
				lng: 18.7699
			}
		}
	]
}

function initMap() {
	var bounds = new google.maps.LatLngBounds();
	var map = new google.maps.Map(document.getElementById('map'), {
		mapTypeControl: false
	});

	for (var i = 0; i < data.places.length; i++) {
		bounds.extend(data.places[i].location);
		
		data.marker = new google.maps.Marker({
			title: data.places[i].title,
			id: i,
			animation: google.maps.Animation.DROP,
			position: data.places[i].location,
			map: map
		});
		data.markers.push(data.marker);
	}
	map.fitBounds(bounds);
}
