'use strict';

exports.register = function(socket) {
  socket.on('broadcast', function (data) {
    console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
		socket.broadcast.emit('broadcast', data);
  });
}