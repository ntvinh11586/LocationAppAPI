const db = require('../db');

module.exports = (io) => {
  io.of('/group_location').on('connection', (socket) => {
    socket.on('update_new_user_location', (newLocationInfo) => {
      const newLocationInfoJSON = JSON.parse(newLocationInfo);
      const userId = newLocationInfoJSON._id;
      const latlng = newLocationInfoJSON.latlng;
      console.log(newLocationInfoJSON);
      db.UserModel.findById(userId, (err, user) => {
        if (err) {
          console.log('err');
        } else if (user == null) {
          console.log('no users');
        } else {
          user.latlng.lat = latlng.lat;
          user.latlng.lng = latlng.lng;
          user.save();
          socket.emit('update_new_user_location_callback', newLocationInfo);
          socket.broadcast.emit('update_new_user_location_callback', newLocationInfo);
        }
      });
    });

    socket.on('get_all_users_location', (groupInfo) => {
      const groupJSON = JSON.parse(groupInfo);
      const groupId = groupJSON.id;
      db.GroupModel.findById(groupId).populate('users').populate('latlng').exec((err, group) => {
        if (err) {
          console.log('err');
        } else if (group == null) {
          console.log('no group');
        } else {
          const users = group.users;
          let locations = [];
          for (let i = 0; i < users.length; i += 1) {
            if (users[i].latlng != null) {
              locations.push({ _id: users[i]._id, latlng: users[i].latlng });
            }
          }
          socket.emit('get_all_users_location_callback', { latlng: locations });
        }
      });
    });
  });


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
