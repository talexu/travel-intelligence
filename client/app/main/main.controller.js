'use strict';

angular.module('travelIntelligenceApp')
.controller('MainCtrl', ['$scope', 'GoogleMapApi'.ns(), 'facebook', function ($scope, GoogleMapApi, facebook) {
	$scope.$on('$viewContentLoaded', function (event) {
		$("#extruderRight").buildMbExtruder({
                position:"right",
                width:300,
                positionFixed:false,
                top:100,
                extruderOpacity:.8,
                onExtOpen:function(){},
                onExtContentLoad:function(){},
                onExtClose:function(){}
            });

		$("#extruderBottom").buildMbExtruder({
                position:"bottom",
                extruderOpacity:1,
                onExtOpen:function(){},
                onExtContentLoad:function(){},
                onExtClose:function(){}

            });
	});
	
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
