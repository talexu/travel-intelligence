'use strict';

angular.module('travelIntelligenceApp')
.service('travel', function ($http, $log, $timeout) {
	// AngularJS will instantiate a singleton by calling "new" on this function
	var applicationid = "&applicationId=1069035773164694153";
	var previxUrlKeyword = "https://app.rakuten.co.jp/services/api/Travel/KeywordHotelSearch/20131024?format=json&datumType=1&keyword=";
	var previxUrlLocation = "https://app.rakuten.co.jp/services/api/Travel/SimpleHotelSearch/20131024?format=json";
	var isDragging = false;
	var latestCenter;
	var latestRadius;
	var interval = 3000;

	this.searchByKeyword = function (keyword, callback, page) {
		if (page) {
			$http.get(previxUrlKeyword + keyword + applicationid + "&page=" + page).success(function (data) {
				callback(data);
			});
		} else {
			$http.get(previxUrlKeyword + keyword + applicationid).success(function (data) {
				callback(data);
			});
		}
	};

	// Only get data when the lock is released
	this.searchByLocation = function (center, radius, callback) {
		latestCenter = center;
		latestRadius = Math.min(3, radius);
		latestRadius = Math.max(0.1, latestRadius);
		if (!isDragging) {
			// lock
			isDragging = true;
			var lat = latestCenter.latitude,
			long = latestCenter.longitude,
			rad = latestRadius;
			$http.get(previxUrlLocation + "&latitude=" + latestCenter.latitude.toString() + "&longitude=" + latestCenter.longitude.toString() + "&datumType=1&searchRadius=" + latestRadius.toFixed(1) + applicationid).success(function (data) {
				callback(data);
				getByLocationAndPage(data, lat, long, rad, callback);
			});
			$timeout(function () {
				// release
				isDragging = false;
			}, interval);
		}
	}

	function getByLocationAndPage(data, lat, long, rad, callback) {
		if (!lat || !long || !rad) {
			return;
		}
		var nextPage = data.pagingInfo.page + 1;
		if (nextPage > data.pagingInfo.pageCount) {
			return;
		}
		$timeout(function () {
			$http.get(previxUrlLocation + "&latitude=" + lat + "&longitude=" + long + "&datumType=1&searchRadius=" + rad.toFixed(1) + applicationid + "&page=" + nextPage).success(function (data) {
				callback(data);
				getByLocationAndPage(data, lat, long, rad, callback);
			});
		}, interval);
	}
});
