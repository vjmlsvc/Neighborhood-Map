// list of places including name, description of location, type of food,
// and location latitude/longitude
var places = [
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
];
