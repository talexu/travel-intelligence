'use strict';

angular.module('travelIntelligenceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('Map', {
        url: '/Map',
        templateUrl: 'app/Map/Map.html',
        controller: 'MapCtrl'
      });
  });