'use strict';

angular.module('travelIntelligenceApp')
.service('googlemap', function () {
	// AngularJS will instantiate a singleton by calling "new" on this function
	var icon1 = {
		path : google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
		scale : 20,
		fillOpacity : 0.8,
		fillColor : 'blue',
		strokeColor : 'gold',
		strokeWeight : 1
	};
	var icon2 = {
		path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
		scale : 20,
		fillOpacity : 0.8,
		fillColor : 'blue',
		strokeColor : 'gold',
		strokeWeight : 1
	};

	var icon3 = {
		path : google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
		scale : 20,
		fillOpacity : 0.8,
		fillColor : 'blue',
		strokeColor : 'gold',
		strokeWeight : 1
	};
	var icon4 = {
		path : google.maps.SymbolPath.FORWARD_OPEN_ARROW,
		scale : 20,
		fillOpacity : 0.8,
		fillColor : 'blue',
		strokeColor : 'gold',
		strokeWeight : 1
	};
	var icon5 = {
		path : google.maps.SymbolPath.CIRCLE,
		scale : 20,
		fillOpacity : 0.8,
		fillColor : 'blue',
		strokeColor : 'gold',
		strokeWeight : 1
	};

	var map;
	var infowindow;
	this.initialize = function () {

		var myLatlng = new google.maps.LatLng(35.5612568, 139.7160511);
		var hotel = new google.maps.LatLng(35.609291, 139.74896);
		var hotel2 = new google.maps.LatLng(35.698004, 139.77084);
		var mapOptions = {
			zoom : 15,
			center : myLatlng
		}
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		var markerarr = []

		/*
		var marker = new google.maps.Marker({
		position: myLatlng,
		map: map,
		icon: icon3,
		title: 'RAKUTEN ICHIBAN'
		});
		 */

		//content: '<div class="infowindow"> Los Feliz Dr and N Skyline Dr Stop 1: intersection near high concentration of medium-high density housing</div>',
		infowindow = new google.maps.InfoWindow({
				content : '<div id="t1"></div><table class="table table-hover"><caption id="panel_hotel_name">Rakuten Travel Hotel</caption><thead><tr><th>Attribute</th><th>Value</th></tr></thead><tbody><tr id="attr1"><td><img src="hotelThumbnail.jpg"><br><img src="roomthumbnail.jpg"></td><td><ul><li><p>abc</p></li><li>def</li><li>ghi</li></ul></td></tr></tbody></table>',

				map : map,
				position : myLatlng

			});

		infowindow.close();

		/*
		var marker2=  new google.maps.Marker({
		position: hotel2,
		map: map,
		icon: icon4,
		title:"HOTELLLLL"

		}
		);

		 */

		var res = {};
		var success = {};
		$.ajax({
			dataType : "json",
			url : "https://app.rakuten.co.jp/services/api/Travel/SimpleHotelSearch/20131024?format=json&datumType=1&latitude=35.6996354&longitude=139.7722308&applicationId=1040051729687398622",
			data : "",
			success : function (data) {
				//  alert(data["hotels"][0]["hotel"][0]["hotelBasicInfo"]["latitude"]);
				//  alert(data["hotels"][0]["hotel"][0]["hotelBasicInfo"]["longitude"]);
				var i;
				//alert(data["hotels"].length);
				for (i = 0; i < data["hotels"].length; i++) {

					var marker = new google.maps.Marker({
							position : new google.maps.LatLng(data["hotels"][i]["hotel"][0]["hotelBasicInfo"]["latitude"], data["hotels"][i]["hotel"][0]["hotelBasicInfo"]["longitude"]),
							map : map,
							title : 'RAKUTEN ICHIBAN'
						});
					markerarr.push(marker);

				}
				res = data
			}
		});

		var last = {}
		var updateflag = false;
		var image = "flag_taiwan_small.gif";

		var myicon = {
			url : 'green.png',
			//url: 'g.jpg',
			// This marker is 20 pixels wide by 32 pixels tall.
			size : new google.maps.Size(32, 32),
			scaledSize : new google.maps.Size(32, 32),
			origin : new google.maps.Point(0, 0)
		};

		var defaulticon = {
			path : google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
			scale : 6,
			fillOpacity : 0.8,
			fillColor : 'black',
			strokeColor : 'gold',
			strokeWeight : 2
		};

		var ratings = [{
				path : google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
				scale : 6,
				fillOpacity : 0.8,
				fillColor : 'black',
				strokeColor : 'black',
				strokeWeight : 2
			}, {
				path : google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
				scale : 6,
				fillOpacity : 0.8,
				fillColor : 'black',
				strokeColor : 'purple',
				strokeWeight : 2
			}, {
				path : google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
				scale : 6,
				fillOpacity : 0.8,
				fillColor : 'black',
				strokeColor : 'blue',
				strokeWeight : 2
			}, {
				path : google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
				scale : 6,
				fillOpacity : 0.8,
				fillColor : 'black',
				strokeColor : 'red',
				strokeWeight : 2
			}, {
				path : google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
				scale : 6,
				fillOpacity : 0.8,
				fillColor : 'black',
				strokeColor : 'gold',
				strokeWeight : 2
			}
		];

var maketable = function(DS, iter)  {
  infowindow.setContent('<table border="2" bgcolor="#00FF00" class="table table-hover"><caption id="panel_hotel_name">' + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["hotelName"] + '</caption><tbody><tr class="info" id="attr1"><td><img src="'+DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["hotelThumbnailUrl"]+'"><br><img src="'+DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["roomThumbnailUrl"]+'"></td><td><ul><li><a href="'+DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["hotelInformationUrl"]+'">Book Now!</a></p>\
</li><li>'+DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["userReview"]+'</li><li>' + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["address1"]+DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["address2"] 
+ '</li><li><div id="star">'+ DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["reviewAverage"]  +'</div></li></ul></td></tr></tbody></table>')

}
/*

		var maketable = function (DS, iter) {
			infowindow.setContent('<table class="table table-hover"><caption id="panel_hotel_name">' + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["hotelName"] + '</caption><tbody><tr id="attr1"><td><img src="hotelThumbnail.jpg"><br><img src="roomthumbnail.jpg"></td><td><ul><li><p>' + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["hotelInformationUrl"] + '</p>\
								</li><li>' + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["userReview"] + '</li><li>ghi</li></ul></td></tr></tbody></table>')

		}
*/
		var h = function () {

			for (var i = 0; i < markerarr.length; i++)
				markerarr[i].setMap(null);

			$.ajax({
				dataType : "json",
				url : "https://app.rakuten.co.jp/services/api/Travel/SimpleHotelSearch/20131024?format=json&datumType=1&latitude=" + last.lat() + "&longitude=" + last.lng() + "&applicationId=1040051729687398622",
				data : "",
				success : function (data) {
					//  alert(data["hotels"][0]["hotel"][0]["hotelBasicInfo"]["latitude"]);
					//  alert(data["hotels"][0]["hotel"][0]["hotelBasicInfo"]["longitude"]);
					var i;
					//alert(data["hotels"].length);
					for (i = 0; i < data["hotels"].length; i++) {
						var marker = new google.maps.Marker({
								position : new google.maps.LatLng(data["hotels"][i]["hotel"][0]["hotelBasicInfo"]["latitude"], data["hotels"][i]["hotel"][0]["hotelBasicInfo"]["longitude"]),
								map : map,
								title : data["hotels"][i]["hotel"][0]["hotelBasicInfo"]["hotelName"] + " __ " + data["hotels"][i]["hotel"][1]["hotelRatingInfo"]["serviceAverage"],
								icon : ratings[Math.floor(data["hotels"][i]["hotel"][0]["hotelBasicInfo"]["reviewAverage"])]
								//icon:ratings[0]
							});
						google.maps.event.addListener(marker, 'mouseover', function (DS, iter) {

							return function () {
								maketable(DS, iter);
								//infowindow.setContent('<table class="table table-hover"><caption id="panel_hotel_name">' + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["hotelName"] + '</caption><thead><tr><th>Attribute</th><th>Value</th></tr></thead><tbody><tr id="attr1"><td><img src="hotelThumbnail.jpg"><br><img src="roomthumbnail.jpg"></td><td><ul><li><p>abc</p></li><li>def</li><li>ghi</li></ul></td></tr></tbody></table>');
								infowindow.open(map, this);

								$("#attr1").html("<td> HotelNo </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["hotelNo"] + "</td>");
								$("#attr2").html("<td> hotelName </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["hotelName"] + "</td>");
								$("#attr3").html("<td> hotelInformationUrl </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["hotelInformationUrl"] + "</td>");
								$("#attr4").html("<td> planListUrl </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["planListUrl"] + "</td>");
								$("#attr5").html("<td> dpPlanListUrl </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["dpPlanListUrl"] + "</td>");
								$("#attr6").html("<td> reviewUrl </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["reviewUrl"] + "</img></td>");
								$("#attr7").html("<td> hotelKanaName </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["hotelKanaName"] + "</td>");
								$("#attr8").html("<td> hotelSpecial </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["hotelSpecial"] + "</td>");
								$("#attr9").html("<td> hotelMinCharge </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["hotelMinCharge"] + "</td>");
								$("#attr10").html("<td> latitude </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["latitude"] + "</td>");
								$("#attr11").html("<td> longitude </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["longitude"] + "</td>");
								$("#attr12").html("<td> postalCode </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["postalCode"] + "</td>");
								$("#attr13").html("<td> address1 </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["address1"] + "</td>");
								$("#attr14").html("<td> address2 </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["address2"] + "</td>");
								$("#attr15").html("<td> telphoneNo </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["telephoneNo"] + "</td>");
								$("#attr16").html("<td> faxNo </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["faxNo"] + "</td>");
								$("#attr17").html("<td> access </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["access"] + "</td>");
								$("#attr18").html("<td> parkingInformation </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["parkingInformation"] + "</td>");
								$("#attr19").html("<td> nearestStation </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["nearestStation"] + "</td>");
								$("#attr20").html("<td> hotelImageUrl </td>" + "<td><img src='" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["hotelImageUrl"] + "'></td>");
								$("#attr21").html("<td> hotelThumbnailUrl </td>" + "<td><img src='" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["hotelThumbnailUrl"] + "'></td>");
								$("#attr22").html("<td> roomImageUrl </td>" + "<td><img src='" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["roomImageUrl"] + "'></td>");
								$("#attr23").html("<td> roomThumbnailUrl </td>" + "<td><img src='" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["roomThumbnailUrl"] + "'></td>");
								$("#attr24").html("<td> hotelMapImageUrl </td>" + "<td><img src='" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["hotelMapImageUrl"] + "'></td>");
								$("#attr25").html("<td> reviewCount </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["reviewCount"] + "</td>");
								$("#attr26").html("<td> reviewAverage </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["reviewAverage"] + "</td>");
								$("#attr28").html("<td> parkingInformation </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["parkingInformation"] + "</td>");
								$("#attr29").html("<td> reviewAverage </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["reviewAverage"] + "</td>");
								$("#attr30").html("<td> UserReview </td>" + "<td>" + DS["hotels"][iter]["hotel"][0]["hotelBasicInfo"]["userReview"] + "</td>");
							}
						}
							(data, i));

						markerarr.push(marker);
					}
					res = data;
				}
			});

			updateflag = false;
		}

		google.maps.event.addListener(map, 'center_changed', function () {
			// 3 seconds after the center of the map has changed, pan back to the
			// marker.
			//setAllMap(null);
			last = map.getCenter();
			if (updateflag == false) {
				updateflag = true;
				window.setTimeout(function () {
					h();
				}, 3000);
			}

		});
		//alert($.param(success));
		//
		$("#searchbar").click(function () {
			$.ajax({
				dataType : "json",
				url : "https://app.rakuten.co.jp/services/api/Travel/KeywordHotelSearch/20131024?format=json&datumType=1&keyword=" + $("#searchcontent").val() + "&applicationId=1040051729687398622",
				data : "",
				success : function (data) {
					alert(data["hotels"][0]["hotel"][0]["hotelBasicInfo"]["longitude"]);
					alert(data["hotels"][0]["hotel"][0]["hotelBasicInfo"]["latitude"]);
					map.panTo(new google.maps.LatLng(data["hotels"][0]["hotel"][0]["hotelBasicInfo"]["latitude"], data["hotels"][0]["hotel"][0]["hotelBasicInfo"]["longitude"]));
				}

			});

			alert($("#searchcontent").val());
		});

		$("#showit").click(function () {
			if ($("#quickview").is(":visible"))
				$("#quickview").slideUp();
			else {
				$("#quickview").slideDown();
				$("#quickview").focus();

			}
		});

	}
	
	//initialize();
});
