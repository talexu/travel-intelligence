'use strict';

angular.module('travelIntelligenceApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
	'google-maps'.ns()
])
	.config(['GoogleMapApiProvider'.ns(), function (GoogleMapApi) {
	    GoogleMapApi.configure({
	        key: 'AIzaSyDP9sT9ttOPhK8xhoqV5L6Uqg776GiVKjQ',
	        v: '3.17',
	        libraries: 'weather,geometry,visualization'
	    });
	}])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });