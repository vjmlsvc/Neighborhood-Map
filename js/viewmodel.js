var model = {
	// handles the filter and updates visibility of
	// places based on it
	initPlaces: function() {
		var self = this;
		self.filter = ko.observable("");
		self.menuVisibility = ko.observable(true);

		self.places = ko.computed(function() {
			var string;
			var query = self.filter().toLowerCase();
			// iterates through all places and checks for instance
			// of self.filter, then sets visibility of each place based
			// on its presence
			for (var i = 0; i < places.length; i++) {
				string = places[i].name.toLowerCase();
				places[i].visible(string.indexOf(query) != -1);
			} return places;
		}, self);
		self.places.subscribe(function(){view.updateMap();});
	},

	// icons to be used for markers
	icons: {
		default: "img/marker-purple.png",
		highlight: "img/marker-blue.png",
	},

	// array that will hold all markers
	markers: [],

	// array that will hold all infowindow contents once loaded
	infoWindowContent: []
};

var view = {
	map: null,
	bounds: null,
	prevMarker: null,
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
		for (var i = 0; i < places.length; i++) {
			var marker = new google.maps.Marker({
				title: places[i].name,
				id: i,
				position: places[i].location,
				icon: model.icons.default,
				map: map
			});
			model.markers.push(marker);

			// adds listeners to markers for mouse-over and click events
			marker.addListener("mouseover", view.highlightToggle.bind(this, marker));
			marker.addListener("mouseout", view.highlightToggle.bind(this, marker));
			marker.addListener("click", view.clickToggle.bind(this, marker, infoWindow));
		}

		// calls updateMap to handle setting bounds
		view.updateMap();
	},

	// handles hamburger menu behaviour
	hamburger: function() {
		this.menuVisibility(!this.menuVisibility());
	},

	// handles google map failing to load
	mapError: function() {
		alert("Google Maps API failed to load.");
	},

	// changes the highlighting of passed marker based on current state by
	// toggling the focused property of relevant place and toggling the icon
	highlightToggle: function(marker) {
		if (places[marker.id].focused()) {
			places[marker.id].focused(false);
			marker.setIcon(model.icons.default);
		} else {
			places[marker.id].focused(true);
			marker.setIcon(model.icons.highlight);
		}
	},

	// populates the infoWindow with fourSquare and hardcoded data
	clickToggle: function(marker, infowindow) {
		// tracks previously clicked marker to turn off animation as needed
		if (view.prevMarker && view.prevMarker != marker)
			view.prevMarker.setAnimation(null);
		view.prevMarker = marker;
		marker.setAnimation(google.maps.Animation.BOUNCE);

		// centers map on clicked marker
		map.panTo(marker.getPosition());

		var fourSquareRequest = view.fourSquare(places[marker.id]);
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
			view.prevMarker.setAnimation(null);
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
		for (var i = 0; i < places.length; i++) {
			if (places[i].visible()) {
				model.markers[i].setVisible(true);
				bounds.extend(places[i].location);
			} else model.markers[i].setVisible(false);
		}
		if (!bounds.isEmpty()) map.fitBounds(bounds);
	}
};

// let there be light
ko.applyBindings(new model.initPlaces());
