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
	self.visible = ko.observable(true);
	self.highlight = ko.observable(false);
}


function ViewModel() {
	var self = this;
	self.filter = ko.observable("");
	// iterates through data.allPlaces and sets visibility based on
	// self.filter
	self.places = ko.computed(function() {
		var string;
		var query = self.filter().toLowerCase();
		for (var i = 0; i < data.allPlaces.length; i++) {
			string = data.allPlaces[i].title.toLowerCase();
			data.allPlaces[i].visible(string.indexOf(query) != -1);
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
	var infoWindow = new google.maps.InfoWindow();

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
		marker.addListener('mouseover', function() {
			this.setIcon(highlightIcon);
		});
		marker.addListener('mouseout', function() {
			this.setIcon(defaultIcon);
		});
		marker.addListener('click', function() {
			makeInfoWindow(this, infoWindow);
		});
	}


	// iterates through places checking for visibility. if visible sets
	// animation to DROP and sets the map to 'map', otherwise sets the
	// map to null hiding the marker. updates map bounds to encompass
	// all visible markers
	function updateMap() {
		var bounds = new google.maps.LatLngBounds();
		for (var i = 0; i < places.length; i++) {
			if (places[i].visible()) {
				data.markers[i].setMap(map);
				data.markers[i].setAnimation(google.maps.Animation.DROP);
				bounds.extend(places[i].location);
			} else data.markers[i].setMap(null);
		}
		if (!bounds.isEmpty()) map.fitBounds(bounds);
	}
	// gives a global name for the updateMap() function
	initMap.updateMap = updateMap;

	function makeInfoWindow(marker, infowindow) {
		if (infowindow.marker != marker) {
			var infoWindowContent = ko.observable(fourSquare(marker));
			infowindow.setContent(infoWindowContent());
			infowindow.marker = marker;
			infowindow.addListener('closeclick', function() {
				infowindow.marker = null;
			});
			infowindow.open(map, marker);
		}
		google.maps.event.addListener(map, 'click', function() {
			infowindow.close();
		});
	}
}


ko.applyBindings(new ViewModel());

function fourSquare(info) {
	var output;
	var latlng = {"lat": 42.5, "lng": 18.7};
	var query = info.title;
	var fourSquareClient = "52MHHRRIWWVKLYKB0XUUVI0RTBHC1G2NH3UZNKDAUQATPXKL";
	var fourSquareSecret = "ZLBGN2ZYYU0I3JJI0XY4NU4SSIN4KM2V4ZZSY23V05KGP2XG";
	var fourSquareURL = "https://api.foursquare.com/v2/venues/search" +
		"?ll=" + latlng.lat + "," + latlng.lng +
		"&client_id=" + fourSquareClient +
		"&client_secret=" + fourSquareSecret +
		"&v=" + "20170808" +
		"&query=" + query;
	$.ajax(fourSquareURL).done(function(data) {
		output = query + " -- " + data.response.venues[0].categories[0].name;
		console.log(output);
	});
}