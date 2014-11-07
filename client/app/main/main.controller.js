'use strict';

angular.module('travelIntelligenceApp')
.controller('MainCtrl', ['$scope', 'GoogleMapApi'.ns(), function ($scope, GoogleMapApi) {

	//GoogleMap API key: AIzaSyDP9sT9ttOPhK8xhoqV5L6Uqg776GiVKjQ
	$scope.map = {
	    center: {
	        latitude: 45,
	        longitude: -73
	    },
	    zoom: 8
	};
	GoogleMapApi.then(function(maps) {
		
	});
	// GoogleMap End

	// Chat
	// $scope.message = 'Hello';
	// $scope.sendMessage = function () {
	// 	socket.emit('broadcast', {
	// 		id : facebook.getName(),
	// 		text : $scope.message
	// 	});
	// 	$("<p>" + $scope.message + "</p>").appendTo("#messages");
	// 	$scope.message = '';
	// }
	//
	// socket.on('broadcast', function (data) {
	// 	// $scope.messages.push(data);
	// 	$("<p>" + data.id + ": " + data.text + "</p>").appendTo("#messages");
	// });
	// Chat end
}]);
