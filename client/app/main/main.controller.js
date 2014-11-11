'use strict';

angular.module('travelIntelligenceApp')
.controller('MainCtrl', ['$scope', '$filter', '$timeout', 'GoogleMapApi'.ns(), 'Logger'.ns(), 'facebook', 'travel', function ($scope, $filter, $timeout, GoogleMapApi, $log, facebook, travel) {
			$log.doLog = true;

			// init
			$scope.$on('$viewContentLoaded', function (event) {
				resize();
			});

			$(window).resize(function () {
				resize();
			});

			function resize() {
				var windowHeight = $(window).height();
				var contentHeight = windowHeight - $('#navigation').height() - $('#row_search').height() - 35;
				$('#row_main').height(contentHeight);
				$('.angular-google-map-container').height(contentHeight);
				$('#searching_results_panel').height(contentHeight);
			}
			// init end

			// search
			$scope.query = {
				keyword : '品川',
				sortingExpression : 'overallRating',
				visualSortingExpression : 'Rating',
				sortingReverse : true,
				visualSortingReverse : 'High → Low',
			};
			$scope.currentPage = 0;
			$scope.pageCount = 0;
			$scope.rightSlidingIsOpen = false;
			// search end

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
					showBicycling : true,
					showWeather : true,
					showHeat : true,
					center : {
						latitude : 35.61,
						longitude : 139.75
					},
					options : {
						streetViewControl : true,
						panControl : true,
						maxZoom : 20,
						minZoom : 3
					},
					zoom : 14,
					fit : true,
					doClusterRandomMarkers : true,
					bounds : {},
					dragging : true,
					events : {
						// center_changed: function (map, eventName, originalEventArgs) {
						// 							$log.info(originalEventArgs);
						// 						}
					},
					clusterEvents : {
						mouseover : function (cluster, clusterModels) {
							var sum = 0;
							_.each(clusterModels, function (model) {
								sum += model.hotel[0].hotelBasicInfo.hotelMinCharge;
							});
							// alert(sum / clusterModels.length);
							$log.info(sum / clusterModels.length);
						}
					},
					clusterOptions : {
						"gridSize" : 60,
						"ignoreHidden" : true,
						"minimumClusterSize" : 4
					},
					hotels : [],
					testHotels : [{
							id : 1,
							latitude : 45,
							longitude : -74,
							showWindow : false,
							options : {
								animation : 1,
								labelContent : 'Markers id 1',
								labelAnchor : "22 0",
								labelClass : "marker-labels"
							}
						}, {
							id : 2,
							latitude : 15,
							longitude : 30,
							showWindow : false,
						}, {
							id : 3,
							icon : 'assets/images/plane.png',
							latitude : 37,
							longitude : -122,
							showWindow : false,
							title : 'Plane',
							options : {
								labelContent : 'Markers id 3',
								labelAnchor : "26 0",
								labelClass : "marker-labels"
							}
						}
					],
				},
			});
			GoogleMapApi.then(function (maps) {
				$scope.googleVersion = maps.version;
				maps.visualRefresh = true;

				$scope.$watch('map.center', function (newValue, oldValue) {
					searchByLocation();
				}, true);
				$scope.$watch('map.zoom', function (newValue, oldValue) {
					searchByLocation();
				}, true);
			});
			function searchByLocation() {
				var distance = 6;
					if ($scope.map.bounds.northeast && $scope.map.bounds.southwest) {
						distance = geolib.getDistance($scope.map.bounds.northeast, $scope.map.bounds.southwest) / 1000;
						$log.info("distance: " + distance);
					}
					travel.searchByLocation($scope.map.center, distance / 2, function (data, status) {
						$scope.map.fit = false;
						injectHotels(data.hotels);
					});
			}
			$scope.refreshMap = function (location) {
				//optional param if you want to refresh you can pass null undefined or false or empty arg
				$scope.map.control.refresh(location);
				$scope.map.control.getGMap().setZoom(11);
				return;
			};
			$scope.getMapInstance = function () {
				alert("You have Map Instance of" + $scope.map.control.getGMap().toString());
				return;
			};
			$scope.searchByKeyword = function () {
				$scope.map.hotels = [];
				$scope.searchByKeywordAndPage();
			};
			$scope.searchByKeywordAndPage = function (page) {
				travel.searchByKeyword($scope.query.keyword, function (data, status) {
					$scope.currentPage = data.pagingInfo.page;
					$scope.pageCount = data.pagingInfo.pageCount;
					$scope.map.fit = true;
					injectHotels(data.hotels, true);
				}, page);
			};
			$scope.doSort = function(expression, vexpression, reverse, vreverse) {
				$scope.query.sortingExpression = expression;
				$scope.query.visualSortingExpression = vexpression;
				$scope.query.sortingReverse = reverse;
				$scope.query.visualSortingReverse = vreverse;
				sortHotels();
			};
			function injectHotels(hotels, open) {
				_.each(hotels, function (hotel) {
					if (_.find($scope.map.hotels, function (h) {
							return h.id == hotel.hotel[0].hotelBasicInfo.hotelNo;
						})) {
						return;
					}
					hotel.id = hotel.hotel[0].hotelBasicInfo.hotelNo;
					hotel.latitude = hotel.hotel[0].hotelBasicInfo.latitude;
					hotel.longitude = hotel.hotel[0].hotelBasicInfo.longitude;
					hotel.showWindow = false;

					var ratingInfo = hotel.hotel[1].hotelRatingInfo;
					var accumulatedRating = ratingInfo.serviceAverage + ratingInfo.locationAverage + ratingInfo.roomAverage + ratingInfo.equipmentAverage + ratingInfo.bathAverage + ratingInfo.mealAverage;
					hotel.overallRating = Math.round(accumulatedRating / 6);

					if (hotel.overallRating >= 4) {
						hotel.icon = '/app/main/img/marker_red.png';
					} else if (hotel.overallRating == 3) {
						hotel.icon = '/app/main/img/marker_green.png';
					} else {
						hotel.icon = '/app/main/img/marker_blue.png';
					}
					// hotel.icon = hotel.overallRating >= 4 ? '/app/main/img/marker_red.png' : '/app/main/img/marker_blue.png';
					hotel.visualRating = "";
					for (var i = 0; i < 5; i++) {
						hotel.visualRating += i < hotel.overallRating ? "★" : "☆";
					}

					$scope.map.hotels.push(hotel);
					$scope.rightSlidingIsOpen = open;
				});
				sortHotels();
				$timeout(function () {
					FB.XFBML.parse();
				}, 2000);
			}

			function sortHotels() {
				$scope.map.hotels = $filter('orderBy')($scope.map.hotels, $scope.query.sortingExpression, $scope.query.sortingReverse);
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
