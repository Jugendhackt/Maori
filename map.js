
	coordCache = {};

	addFunc = function(){
		var item = [];
		item["name"] = $("#name").val();
		item["street"] = $("#street").val();
		item["streetDisplay"] = $("#street").val();
		item["gueter"] = $("#gueter").val();
		item["transport"] = $("#transport").val();
		console.log(item);
		$.getJSON("http://nominatim.openstreetmap.org/search?street="+item["street"]+"&city="+city+"&format=json"),function(json){
			if(json.length==0){
				console.log(street);
				return;
			};
			console.log("callback add marker");
			buildMapMark(json[0]["lat"], json[0]["lon"], item);
		}
	}

	searchFunc = function(){
		var search = $("#suchfeld").val();
		floMap = document.getElementById("check_floh").checked;
		reMap = document.getElementById("check_re").checked;

		console.log(floMap + " " + reMap);

		init = true;
		map.remove();
		readData(search);
	}

	
	var txt = document.getElementById("suchfeld");
	var go = document.getElementById("btn-search");
	txt.addEventListener("keypress", function(event) {
	    if (event.keyCode == 13){
	    	event.preventDefault();
	        go.click();
	    }
	});

		buildMap = function(database, search, marker){
			var coords = [[]];
			database = database+search;
			$.getJSON(database,function(json2){
				if(!json2) return;
				json2.forEach(function(item, index){
						console.log("Coord-Dict");
						console.log(coordCache);
						if(!(search in coordCache)){
							$.getJSON("http://nominatim.openstreetmap.org/search?street="+item["street"]+"&city="+city+"&format=json",function(json){
								if(json.length==0){
									console.log(street);
									return;
								};
								coords[index] = [json[0]["lat"], json[0]["lon"], item];
								buildMapMark(json[0]["lat"], json[0]["lon"], item);
								console.log("not cached "+(search in coordCache));
							});
						}else{
							buildMapMark(coordCache[search][index][0], coordCache[search][index][1], coordCache[search][index][2]);
							console.log("Cached!");
						}
					});
				if(!(search in coordCache)) 
					coordCache[search] = coords;
				//console.log(coordCache);
			});
		}

		buildMapMark = function(lat, lon, item){
			if(init){
				map = L.map('map').setView([lat, lon], 13);
				OpenStreetMap = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', { maxZoom: 25, minZoom: 5, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);
				init = false;
			};
			L.marker([lat, lon], {icon: marker})
			.bindPopup("<b>"+item["name"]+"</b><br><br>"+item["streetDisplay"]+"<br><br>Güter: "+item["gueter"]+"<br><br>Transport: "+item["transport"])
			.openPopup()
			.addTo(map);
		}

		buildMapL = function(database, search, marker){
			database = database+search;
			$.getJSON(database,function(json3){
				console.log("start of flo "+new Date());
				if(!json3) return;
				json3.forEach(function(item, index){
					var latitude = item["lat"];
					var longitude = item["lon"];
					if(init){
						map = L.map('map').setView([latitude, longitude], 13);
						OpenStreetMap = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', { maxZoom: 25, minZoom: 5, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);
						init = false;
					};
					if(item["website"]=="Keine Angabe"){
						L.marker([latitude, longitude], {icon: marker})
						.bindPopup("<b>"+item["name"]+"</b><br><br>Öffnungszeiten: "+item["time"]+"<br><br>Tage: "+item["days"]+"<br><br>Betreiber: "+item["owner"]+"<br><br>Website: "+item["website"]+"<br><br>Email: "+item["email"]+"<br><br>Bemerkungen: "+item["comment"])
						.openPopup()
						.addTo(map);
					}else{
						L.marker([latitude, longitude], {icon: marker})
						.bindPopup("<b>"+item["name"]+"</b><br><br>Öffnungszeiten: "+item["time"]+"<br><br>Tage: "+item["days"]+"<br><br>Betreiber: "+item["owner"]+"<br><br>Website: <a href=http://"+item["website"]+">"+item["website"]+"</a><br><br>Email: "+item["email"]+"<br><br>Bemerkungen: "+item["comment"])
						.openPopup()
						.addTo(map);
					}
				});
				console.log("end of flo "+new Date());
			});
		}


		readData = function(search){
			if(reMap){
				console.log("preRE "+new Date);
				buildMap("ReJson_Parser.php?q=", search, marker);
				console.log("1st done!");
			}
			if(floMap){
				console.log("preFlo "+new Date);
				buildMapL("FloJson_Parser.php?q=", search, redmarker);
				console.log("2nd done!");
			}
		}




		city = "Berlin";
		init = true;
		gotCoords = false;
		map = {};
		OpenStreetMap = {};
		reMap = true;
		floMap = true;

		var marker = L.icon({
			iconUrl:"leaflet/images/marker-icon.png",
			shadowUrl:"leaflet/images/marker-shadow.png"
		});
		var redmarker = L.icon({
			iconUrl:"leaflet/images/red-marker-icon.png",
			shadowUrl:"leaflet/images/marker-shadow.png"
		});

		readData("");