const db = require('../db');

module.exports = (io, app) => {
  io.of('/location_all_user').on('connection', (socket) => {
    socket.on('get_location', (userId) => {
      // we use userId for authorization.
      db.latlngModel.find({}, (err, latlng) => {
        if (err) {
          console.log(latlng);
        }
        socket.emit('get_location_callback', { user_locations: latlng });
      });
    });
  });

  io.of('/location_one_user').on('connection', (socket) => {
    socket.on('get_location', (userId) => {
      // find userId in db
      // emit {x, y} to users
      db.latlngModel.findOne({ _user_id: userId }, (err, latlng) => {
        if (err) {
          console.log(latlng);
        }
        socket.emit('get_location_callback', JSON.stringify(latlng));
      });
    });

    socket.on('set_location', (newLatlng) => {
      db.latlngModel.findOne({ _user_id: newLatlng._user_id }, (err, latlng) => {
        if (err) {
          socket.emit('get_location_callback', JSON.stringify(latlng));
          socket.broadcast.emit('get_location_callback', JSON.stringify(latlng));
        } else if (latlng) {
          latlng.longitude = newLatlng.longitude;
          latlng.latitude = newLatlng.latitude;
          latlng.save();
          socket.emit('get_location_callback', JSON.stringify(latlng));
          socket.broadcast.emit('get_location_callback', JSON.stringify(latlng));
        } else {
          db.latlngModel.create(newLatlng, (err, latlng) => {
            if (err) {
              console.log(err);
              socket.emit('get_location_callback', JSON.stringify(latlng));
              socket.broadcast.emit('get_location_callback', JSON.stringify(latlng));
            } else {
              socket.emit('get_location_callback', JSON.stringify(latlng));
              socket.broadcast.emit('get_location_callback', JSON.stringify(latlng));
            }
          });
        }
      });
    });
  });
};
