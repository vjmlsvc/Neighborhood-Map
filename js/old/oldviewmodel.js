/*var data = {
	markers: [],
	filteredPlaces: [],
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
*/

function Place(title, visible, location) {
	var self = this;

	self.title = title;
	self.visible = visible;
	self.location = location;
}


function ViewModel() {
	var self = this;
	self.filter = ko.observable("");
	self.places = [
		new Place("The Square Pub", true,
			{lat: 42.4241655, lng: 18.770965}),
		new Place("Bokeski Gusti", true,
			{lat: 42.460363, lng: 18.73907}),
		new Place("Conte", true,
			{lat: 42.4861, lng: 18.6983}),
		new Place("Al Posto Giusto", false,
			{lat: 42.43269, lng: 18.6936}),
		new Place("Forza Cafe", true,
			{lat: 42.42495, lng: 18.7699})
	];

	self.filteredPlaces = ko.computed(function() {
		var filtered = [];
		for (var i = 0; i < self.places.length; i++) {
			var filter = self.filter().toLowerCase();
			var title = self.places[i].title.toLowerCase();
			if (title.indexOf(filter) !== -1)
				filtered.push(self.places[i]);
			else self.places[i].visible = false;
		}
		return filtered;
	}, self);

	self.select = function() {
		alert('test');
	};
}


function initMap() {
	var bounds = new google.maps.LatLngBounds();
	var places = data.filteredPlaces;
	var marker;
	var map = new google.maps.Map(document.getElementById('map'), {
		mapTypeControl: false
	});

	for (var i = 0; i < places.length; i++) {
		bounds.extend(places[i].location);
		marker = new google.maps.Marker({
			title: places[i].title,
			id: i,
			animation: google.maps.Animation.DROP,
			position: places[i].location,
			map: map
		});
		data.markers.push(marker);
	}
	map.fitBounds(bounds);

	google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) {
  		if (this.getZoom() > 18) {
    		this.setZoom(18);
  		}
	});
}


ko.applyBindings(new ViewModel());
