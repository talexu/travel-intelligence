'use strict';

angular.module('travelIntelligenceApp')
  .service('socket', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
		
    var socket = io.connect();
    return socket;
  });
