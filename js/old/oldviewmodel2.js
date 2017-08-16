var data = {
	// places containing name, visibility, and lat/lng pair
	allPlaces: [
		new Place("The Square Pub",
			{lat: 42.4241655, lng: 18.770965}),
		new Place("Bokeski Gusti",
			{lat: 42.460363, lng: 18.73907}),
		new Place("Conte",
			{lat: 42.4861, lng: 18.6983}),
		new Place("Al Posto Giusto",
			{lat: 42.43269, lng: 18.6936}),
		new Place("Forza Cafe",
			{lat: 42.42495, lng: 18.7699})
	],
	markers: []
};


// constructor for places
function Place(title, location) {
	var self = this;

	self.title = title;
	self.location = location;
	self.visible = true;
}


function ViewModel() {
	var self = this;
	self.filter = ko.observable("");
	// iterates through data.allPlaces and sets visibility based on
	// self.filter string
	self.places = ko.computed(function() {
		var title;
		var filter = self.filter().toLowerCase();
		for (var i = 0; i < data.allPlaces.length; i++) {
			title = data.allPlaces[i].title.toLowerCase();
			data.allPlaces[i].visible = title.indexOf(filter) >= 0;
			/*if (~title.indexOf(filter)) {
				data.allPlaces[i].visible = true;
			} else data.allPlaces[i].visible = false;*/
		} return data.allPlaces;
	}, self);
	// calls updateMap() inside initMap() if self.places changes. this
	// ensures only visible markers are shown in map
	self.places.subscribe(function(){initMap.updateMap();});
}


function initMap() {
	var places = data.allPlaces;
	// creates map centered around all places visible by default. sets
	// it so the user can't modify the map in any way directly, only
	// allowing for clicking on the markers
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 42.45514,
			lng: 18.732282
		},
		zoom: 13,
		draggable: false,
		zoomControl: false,
		scaleControl: false,
		scrollwheel: false,
		disableDoubleClickZoom: true,
		disableDefaultUI: true,
		maxZoom: 18
	});


	// icons for V3 google maps markers, as found here:
	// https://stackoverflow.com/questions/17746740/google-map-icons-with-visualrefresh
	var defaultIcon =
		'https://mt.google.com/vt/icon?name=icons/spotlight/spotlight-ad.png';
	var highlightIcon =
		'https://mt.google.com/vt/icon?name=icons/spotlight/spotlight-waypoint-blue.png';

	// iterates through places and creates a marker at each
	for (var i = 0; i < places.length; i++) {
		var marker = new google.maps.Marker({
			title: places[i].title,
			id: i,
			animation: google.maps.Animation.DROP,
			position: places[i].location,
			icon: defaultIcon,
			map: map
		});
		data.markers.push(marker);
		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfoWindow);
		});
		marker.addListener('mouseover', function() {
			this.setIcon(highlightIcon);
		});
		marker.addListener('mouseout', function() {
			this.setIcon(defaultIcon);
		});
	}


	// iterates through places checking for visibility. if visible sets
	// animation to DROP and sets the map to 'map', otherwise sets the
	// map to null hiding the marker. updates map bounds to encompass
	// all visible markers
	function updateMap() {
		var bounds = new google.maps.LatLngBounds();
		for (var i = 0; i < places.length; i++) {
			if (places[i].visible) {
				data.markers[i].setMap(map);
				data.markers[i].setAnimation(google.maps.Animation.DROP);
				bounds.extend(places[i].location);
			} else data.markers[i].setMap(null);
			console.log(places[i].title, places[i].visible);
		} console.log("~~~~~~~~~~~");
		if (!bounds.isEmpty()) map.fitBounds(bounds);
	}
	// gives a global name for the updateMap() function
	initMap.updateMap = updateMap;
}


ko.applyBindings(new ViewModel());
