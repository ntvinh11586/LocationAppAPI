'use strict';
const h = require('../helpers');
const db = require('../db');

module.exports = (io, app) => {
  let allrooms = app.locals.chatrooms;
  let location = app.locals.location;

  io.of('/locations').on('connection', socket => {

    socket.on('getCurrentLocation', () => {
      socket.emit('getLocation', JSON.stringify(location));
    });

    socket.on('newLocation', newLocation => {
      location = newLocation;
      socket.emit('getLocation', JSON.stringify(location));
      socket.broadcast.emit('getLocation', JSON.stringify(location));
    });

  });

  io.of('/location_one_user').on('connection', socket => {

    socket.on('get_location', userId => {
      // find userId in db
      // emit {x, y} to users
      db.latlngModel.findOne({_user_id: userId}, (err, latlng) => {
        var latlng;
        if (err || !latlng) {
          console.log(latlng);
          socket.emit('get_location_callback', JSON.stringify(location));
        } else {
          latlng = {
            latitude: latlng.latitude,
            longitude: latlng.longitude
          }
          socket.emit('get_location_callback', JSON.stringify(latlng));
        }
      });
    });

    socket.on('set_location', newLatlng => {
      console.log(newLatlng);
      db.latlngModel.findOne({_user_id: newLatlng._user_id}, (err, latlng) => {
        if (err) {
          console.log(err);
          socket.emit('get_location_callback', JSON.stringify(latlng));
          socket.broadcast.emit('get_location_callback', JSON.stringify(latlng));
        } else {
          if (latlng) {
            console.log(latlng);
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
        }
      });
    });

  });
}
