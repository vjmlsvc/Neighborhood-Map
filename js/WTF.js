var data = {
	markers: [],
	places: [
		{
			title: "The Square Pub",
			visible: true,
			location: {
				lat: 42.4241655,
				lng: 18.770965
			}
		},{
			title: "Bokeski Gusti",
			visible: true,
			location: {
				lat: 42.460363,
				lng: 18.73907
			}
		},{
			title: "Conte",
			visible: true,
			location: {
				lat: 42.4861,
				lng: 18.6983
			}
		},{
			title: "Al Posto Giusto",
			visible: true,
			location: {
				lat: 42.43269,
				lng: 18.6936
			}
		},{
			title: "Forza Cafe",
			visible: true,
			location: {
				lat: 42.42495,
				lng: 18.7699
			}
		}
	]
}


function ViewModel(){
	var filter = ko.observable("");
	function places() {
		data.places[i].visible = data.places[i].title.indexOf(filter) !== -1;
	}

/*	filteredList = ko.computed(function() {
		var filtered = [];
		for (var i = 0; i < self.allPlaces.length; i++) {
			self.allPlaces[i].visible = self.allPlaces[i].title.indexOf(self.filter) !== -1;
			console.log(self.filter);
			if (self.allPlaces[i].visible) filtered.push(self.allPlaces[i]);
		}
		return filtered;
	}, self);*/

/*	filter = function(substring) {
		console.log(substring);
		// data.places.removeAll();
		for (var i = 0; i < self.places.length; i++) {
			self.places[i].visible = self.places[i].indexOf(substring) !== -1;
			console.log(self.places[i].visible);
		}
	}*/
}


function initMap() {
	var bounds = new google.maps.LatLngBounds();
	var map = new google.maps.Map(document.getElementById('map'), {
		mapTypeControl: false
	});

	for (var i = 0; i < data.places.length; i++) {
		if (data.places[i].visible) {
			bounds.extend(data.places[i].location);
			data.marker = new google.maps.Marker({
				title: data.places[i].title,
				id: i,
				animation: google.maps.Animation.DROP,
				position: data.places[i].location,
				map: map
			});
		}
		data.markers.push(data.marker);
	}
	map.fitBounds(bounds);
}


ko.applyBindings(new ViewModel());
