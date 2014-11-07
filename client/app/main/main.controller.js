'use strict';

angular.module('travelIntelligenceApp')
.controller('MainCtrl', ['$scope', 'GoogleMapApi'.ns(), 'Logger'.ns(), 'facebook', function ($scope, GoogleMapApi, $log, facebook) {
			$scope.$on('$viewContentLoaded', function (event) {
				$("#extruderRight").buildMbExtruder({
					position : "right",
					width : 300,
					positionFixed : false,
					top : 100,
					extruderOpacity : .8,
					onExtOpen : function () {},
					onExtContentLoad : function () {},
					onExtClose : function () {}
				});

				$("#extruderBottom").buildMbExtruder({
					position : "bottom",
					extruderOpacity : 1,
					onExtOpen : function () {},
					onExtContentLoad : function () {},
					onExtClose : function () {}

				});
			});

			//GoogleMap API key: AIzaSyDP9sT9ttOPhK8xhoqV5L6Uqg776GiVKjQ
			angular.extend($scope, {
				map : {
					show : true,
					control : {},
					version : "uknown",
					heatLayerCallback : function (layer) {
						//set the heat layers backend data
						var mockHeatLayer = new MockHeatLayer(layer);
					},
					showTraffic : true,
					showBicycling : false,
					showWeather : false,
					showHeat : false,
					center : {
						latitude : 45,
						longitude : -73
					},
					options : {
						streetViewControl : false,
						panControl : false,
						maxZoom : 20,
						minZoom : 3
					},
					zoom : 3,
					bounds : {},
					dragging: false,
					events : {},

				}
			});
			GoogleMapApi.then(function (maps) {
				$scope.googleVersion = maps.version;
				maps.visualRefresh = true;
				$log.info('$scope.map.rectangle.bounds set');
				
			});

			$scope.getMapInstance = function () {
				alert("You have Map Instance of" + $scope.map.control.getGMap().toString());
				return;
			}

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
		}
	]);
