'use strict';

angular.module('travelIntelligenceApp')
  .controller('MainCtrl', function ($scope, socket, facebook, googlemap, travel, frontend) {
    $scope.message = 'Hello';
		
    $scope.sendMessage = function () {
      socket.emit('broadcast', {
				id: facebook.getName(),
        text: $scope.message
      });
      $("<p>" + $scope.message + "</p>").appendTo("#messages");
      $scope.message = '';
    }
    
    socket.on('broadcast', function (data) {
      // $scope.messages.push(data);
      $("<p>" + data.id + ": " + data.text + "</p>").appendTo("#messages");
    });

  });
