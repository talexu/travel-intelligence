'use strict';

angular.module('travelIntelligenceApp')
.controller('MainCtrl', ['$scope', '$filter', '$timeout', 'GoogleMapApi'.ns(), 'Logger'.ns(), 'facebook', 'travel', 'socket', function ($scope, $filter, $timeout, GoogleMapApi, $log, facebook, travel, socket) {
			$log.doLog = true;
			var SOURCE_KEYWORD = 'keyword';
			var SOURCE_LOCATION = 'location';
			var googleMapLoaded = false;

			// init
			$scope.$on('$viewContentLoaded', function (event) {
				resize();
			});

			$(window).resize(function () {
				resize();
			});

			function resize() {
				var windowHeight = $(window).height();
				var contentHeight = windowHeight - $('#navigation').height() - 35;
				$('#row_main').height(contentHeight);
				$('.angular-google-map-container').height(contentHeight);
				$('#searching_results_panel').height(contentHeight);
				$('#chatting_panel').height(windowHeight - $('#typing_box').height() - 45);
			}
			// init end

			// search
			$scope.query = {
				keyword : '',
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
					dragging : false,
					events : {
						dragend : function (map, eventName, originalEventArgs) {
							searchByLocation();
						},
						zoom_changed : function (map, eventName, originalEventArgs) {
							searchByLocation();
						},
					},
					clusterEvents : {
						mouseover : function (cluster, clusterModels) {
							var sum = 0;
							_.each(clusterModels, function (model) {
								sum += model.hotel[0].hotelBasicInfo.hotelMinCharge;
							});
						}
					},
					clusterOptions : {
						"gridSize" : 60,
						"ignoreHidden" : true,
						"minimumClusterSize" : 4
					},
					hotels : [],
					markers : [],
				},
			});
			GoogleMapApi.then(function (maps) {
				$scope.googleVersion = maps.version;
				maps.visualRefresh = true;

				navigator.geolocation.getCurrentPosition(
					function (position) {
					$scope.map.center = {
						latitude : position.coords.latitude,
						longitude : position.coords.longitude
					};
					searchByLocation();
				});
			});
			function searchByLocation() {
				$scope.map.fit = false;
				filterHotels();
				var distance = 6;
				if ($scope.map.bounds.northeast && $scope.map.bounds.southwest) {
					distance = geolib.getDistance($scope.map.bounds.northeast, $scope.map.bounds.southwest) / 1000;
				}
				travel.searchByLocation($scope.map.center, distance / 2, function (data, status) {
					filterHotels();
					injectHotels(data.hotels, SOURCE_LOCATION);
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
				$scope.map.markers = [];
				$scope.searchByKeywordAndPage();
			};
			$scope.searchByKeywordAndPage = function (page) {
				$scope.map.fit = true;
				travel.searchByKeyword($scope.query.keyword, function (data, status) {
					$scope.currentPage = data.pagingInfo.page;
					$scope.pageCount = data.pagingInfo.pageCount;
					injectHotels(data.hotels, SOURCE_KEYWORD);
				}, page);
			};
			$scope.doSort = function (expression, vexpression, reverse, vreverse) {
				$scope.query.sortingExpression = expression;
				$scope.query.visualSortingExpression = vexpression;
				$scope.query.sortingReverse = reverse;
				$scope.query.visualSortingReverse = vreverse;
				sortHotels();
			};
			function injectHotels(hotels, source) {
				_.each(hotels, function (hotel) {
					var hotelInResultingList = _.find($scope.map.hotels, function (h) {
							return h.id == hotel.hotel[0].hotelBasicInfo.hotelNo;
						});
					var hotelInTheViewList = _.find($scope.map.markers, function (h) {
							return h.id == hotel.hotel[0].hotelBasicInfo.hotelNo;
						});
					if (hotelInResultingList) {
						if (isInViewArea(hotelInResultingList) && !hotelInTheViewList) {
							$scope.map.markers.push(hotelInResultingList);
						}
						return;
					}

					hotel.source = source;
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
					hotel.visualRating = "";
					for (var i = 0; i < 5; i++) {
						hotel.visualRating += i < hotel.overallRating ? "★" : "☆";
					}

					$scope.map.markers.push(hotel);
					$scope.map.hotels.push(hotel);
				});

				sortHotels();
				$timeout(function () {
					FB.XFBML.parse();
				}, 2000);
			}

			function isInViewArea(location) {
				if (!location) {
					return false;
				}
				if (!location.latitude || !location.longitude) {
					return false;
				} else {
					var ne = $scope.map.bounds.northeast;
					var sw = $scope.map.bounds.southwest;
					if (!ne || !sw) {
						return true;
					}
					return geolib.isPointInside({
						latitude : location.latitude,
						longitude : location.longitude
					},
						[{
								latitude : ne.latitude,
								longitude : sw.longitude
							}, {
								latitude : sw.latitude,
								longitude : sw.longitude
							}, {
								latitude : sw.latitude,
								longitude : ne.longitude
							}, {
								latitude : ne.latitude,
								longitude : ne.longitude
							}
						]);
				}
				return false;
			}
			function filterHotels() {
				$scope.map.markers = $filter('filter')($scope.map.hotels, function (value, index) {
						if (!value) {
							return false;
						}
						if (value.source == SOURCE_KEYWORD) {
							return true;
						} else {
							return isInViewArea(value);
						}
					}, true);
			}
			function sortHotels() {
				$scope.map.hotels = $filter('orderBy')($scope.map.hotels, $scope.query.sortingExpression, $scope.query.sortingReverse);
			}

			// GoogleMap End

			// Chat
			$scope.chat = {
				id : '',
				name : '',
				link : '',
				message : '',
				messages : [
						{
							id : "1",
							name : "Alice",
							link : "http://www.facebook.com",
							message : "Suppose",
						},
						{
							id : "2",
							name : "Bob",
							link : "http://www.google.com",
							message : "You are Alice",
						},
					],
				sendMessage : function () {
					var me = facebook.getMe();
					var mess = $scope.chat.message;
					$scope.chat.message = '';
					
					var re = /\/rename (.+)/g;
					var match = re.exec(mess);
					if (match){
						me.name = match[1];
						return;
					}
					
					var sentMessage = {
						id : me.id,
						name : me.name,
						link : me.link,
						message : mess,
					};
					appendMessage(sentMessage);
					socket.emit('broadcast', sentMessage);
				}
			};
			socket.on('broadcast', function (data) {
				// $scope.messages.push(data);
				appendMessage(data);
			});
			function appendMessage(data) {
				var html = ["<dl>",
				"  <dt><a href=\"",
				data.link,
				"\" target=\"_blank\">",
				data.name,
				"</a></dt>",
				"  <dd>",
				data.message,
				"</dd>",
				"</dl>"].join("");
				$(html).appendTo("#chatting_panel");
			}
			// Chat end
		}
	]);
