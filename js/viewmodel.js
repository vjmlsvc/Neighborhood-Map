// handles hamburger menu behaviour
$(".hamburger").click(function() {
	$(".menu").toggle();
});


var model = {
	// handles the filter and updates visibility of
	// places based on it
	initPlaces: function() {
		var self = this;
		self.filter = ko.observable("");

		self.places = ko.computed(function() {
			var string;
			var query = self.filter().toLowerCase();
			// iterates through all places and checks for instance
			// of self.filter, then sets visibility of each place based
			// on its presence
			for (var i = 0; i < model.places.length; i++) {
				string = model.places[i].name.toLowerCase();
				model.places[i].visible(string.indexOf(query) != -1);
			} return model.places;
		}, self);
		self.places.subscribe(function(){view.updateMap();});
	},

	// icons to be used for markers
	icons: {
		default: "img/marker-purple.png",
		highlight: "img/marker-blue.png",
	},

	// list of places including name, description of location, type of food,
	// and location latitude/longitude
	places: [
		{
			id: 0,
			name: "Al Posto Giusto",
			description: "Located on the waterfront in Porto Montenegro, Tivat",
			style: "Mediterranean, Italian",
			location: {
				lat: 42.43269,
				lng: 18.6936
			},
			visible: ko.observable(true),
			focused: ko.observable(false),
			fourSquareID: "4e3e83637d8b0e96107798c0"
		},
		{
			id: 1,
			name: "Bokeski Gusti",
			description: "Located on the waterfront in Prcanj",
			style: "Mediterranean, Seafood",
			location: {
				lat: 42.460363,
				lng: 18.73907
			},
			visible: ko.observable(true),
			focused: ko.observable(false),
			fourSquareID: "4d6baafe8fe6a1439d7cf7a3"
		},
		{
			id: 2,
			name: "Cesarica",
			description: "Located near the Saint Nicholas Church in old Kotor",
			style: "Mediterranean, Seafood",
			location: {
				lat: 42.4252768,
				lng: 18.770902
			},
			visible: ko.observable(true),
			focused: ko.observable(false),
			fourSquareID: "4e1f2d761f6ee970647ab437"
		},
		{
			id: 3,
			name: "Conte Hotel Restaurant",
			description: "Located on the waterfront in Perast",
			style: "Mediterannean, Seafood",
			location: {
				lat: 42.4861,
				lng: 18.6983
			},
			visible: ko.observable(true),
			focused: ko.observable(false),
			fourSquareID: "4c0573ea761ac9b64b8a1f74"
		},
		{
			id: 4,
			name: "Forza Cafe",
			description: "Located within the city walls near the main entrance to old Kotor",
			style: "Cafe, Desserts",
			location: {
				lat: 42.42495,
				lng: 18.7699
			},
			visible: ko.observable(true),
			focused: ko.observable(false),
			fourSquareID: "4e16d378fa76a474496eed94"
		},
		{
			id: 5,
			name: "The Square Pub",
			description: "Located accross from Saint Tryphon's Cathedral in old Kotor",
			style: "Mediterranean",
			location: {
				lat: 42.4241655,
				lng: 18.770965
			},
			visible: ko.observable(true),
			focused: ko.observable(false),
			fourSquareID: "56feda66498e42bee87bd6a4"
		}
	],

	// array that will hold all markers
	markers: [],

	// array that will hold all infowindow contents once loaded
	infoWindowContent: []
};

var view = {
	map: null,
	bounds: null,
	// initializes the map, creates the infoWindow and marker objects,
	// and listeners for opening, closing, and mousing over markers
	initMap: function() {
		// creates the map with a limited maximum zoom and hidden UI
		map = new google.maps.Map(document.getElementById("map"), {
			disableDefaultUI: true,
			maxZoom: 18
		});

		// creates infowindow with limited maximum width
		var infoWindow = new google.maps.InfoWindow({
			maxWidth: 240
		});

		// creates markers from all entries in places setting the
		// name, id, position, and default icon
		for (var i = 0; i < model.places.length; i++) {
			var marker = new google.maps.Marker({
				title: model.places[i].name,
				id: i,
				position: model.places[i].location,
				icon: model.icons.default,
				map: map
			});
			model.markers.push(marker);

			// adds listeners to markers for mouse-over and click events
			marker.addListener("mouseover", view.highlightToggle.bind(this, marker));
			marker.addListener("mouseout", view.highlightToggle.bind(this, marker));
			marker.addListener("click", view.fillInfoWindow.bind(this, marker, infoWindow));
		}

		// calls updateMap to handle setting bounds
		view.updateMap();
	},

	// changes the highlighting of passed marker based on current state by
	// toggling the focused property of relevant place and toggling the icon
	highlightToggle: function(marker) {
		if (model.places[marker.id].focused()) {
			model.places[marker.id].focused(false);
			marker.setIcon(model.icons.default);
		} else {
			model.places[marker.id].focused(true);
			marker.setIcon(model.icons.highlight);
		}
	},

	// populates the infoWindow with fourSquare and hardcoded data
	fillInfoWindow: function(marker, infowindow) {
		var fourSquareRequest = view.fourSquare(model.places[marker.id]);
		// if data has been retrieved previously loads it
		if (model.infoWindowContent[marker.id])
			infowindow.setContent(model.infoWindowContent[marker.id]);

		// if current marker's infowindow data hasn't been retrieved
		// makes an ajax request for it while displaying a progress
		// message
		else {
			infowindow.setContent("Fetching data from FourSquare...");
			$.ajax(fourSquareRequest)
			.done(function(data) {
				var info = data.response.venue;
				var content = "";
				content += marker.title + "<br>";
				if (info.contact.formattedPhone)
					content += info.contact.formattedPhone + "<br>";
				content += "Prices: " + info.price.message + "<br>";
				content += "Likes: " + info.likes.count + "<br>";
				content += "<img src=" + info.bestPhoto.prefix + "160x160" +
					info.bestPhoto.suffix + "><br>";
				content += "<a class='link' target='_blank'" +
					" href=http://foursquare.com/v/" + info.id +
					">powered by FourSquare</a>";

				model.infoWindowContent[marker.id] = content;
				infowindow.setContent(content);
			})
			// if the ajax request failed for any reason notifies the user
			// about what's missing
			.fail(infowindow.setContent("Failed to retreive data from FourSquare."));
		}

		// opens infowindow
		infowindow.marker = marker;
		infowindow.open(map, marker);

		// closes infoWindow when the close button is clicked
		infowindow.addListener("closeclick", function() {
			infowindow.close();
		});
		// closes infoWindow when the map is clicked
		google.maps.event.addListener(map, "click", function() {
			infowindow.close();
		});
	},

	// generates URL for fourSquare requests based on place requested
	fourSquare: function(place) {
		var fourSquareClient = "52MHHRRIWWVKLYKB0XUUVI0RTBHC1G2NH3UZNKDAUQATPXKL";
		var fourSquareSecret = "ZLBGN2ZYYU0I3JJI0XY4NU4SSIN4KM2V4ZZSY23V05KGP2XG";

		var fourSquareURL = "https://api.foursquare.com/v2/venues/" +
			place.fourSquareID + "?client_id=" + fourSquareClient +
			"&client_secret=" + fourSquareSecret + "&v=20170808";

		return fourSquareURL;
	},

	// updates the map bounds if they change and are valid
	updateMap: function() {
		bounds = new google.maps.LatLngBounds();
		// sets bounds based on visibility of markers
		for (var i = 0; i < model.places.length; i++) {
			if (model.places[i].visible()) {
				model.markers[i].setMap(map);
				bounds.extend(model.places[i].location);
			} else model.markers[i].setMap(null);
		}
		if (!bounds.isEmpty()) map.fitBounds(bounds);
	}
};

// let there be light
ko.applyBindings(new model.initPlaces());
