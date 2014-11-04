'use strict';

angular.module('travelIntelligenceApp')
.controller('MainCtrl', function ($scope, socket, facebook, googlemap, travel, frontend) {

	// Google map
	$scope.$on('$viewContentLoaded', function (event) {
		googlemap.initialize();
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
			else
				$("#quickview").slideDown();
		});
	});
	// Google map end

	// Chat
	$scope.message = 'Hello';
	$scope.sendMessage = function () {
		socket.emit('broadcast', {
			id : facebook.getName(),
			text : $scope.message
		});
		$("<p>" + $scope.message + "</p>").appendTo("#messages");
		$scope.message = '';
	}

	socket.on('broadcast', function (data) {
		// $scope.messages.push(data);
		$("<p>" + data.id + ": " + data.text + "</p>").appendTo("#messages");
	});
	// Chat end
});
