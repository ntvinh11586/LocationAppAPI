const userRepository = require('../repositories/user');

function acceptFriend(userId, acceptedFriendId, callback) {
  userRepository.findById(userId, (err, user) => {
    if (err) {
      callback(err, {
        status_code: 422,
        success: false,
        status_message: err.message,
      });
    }
    if (user.friend_requests.some(x => x.equals(acceptedFriendId))) {
      userRepository.findById(acceptedFriendId, (err, friend) => {
        if (err) {
          callback(err, {
            status_code: 422,
            success: false,
            status_message: err.message,
          });
        }
        // add friend
        user.friends.push(friend);
        friend.friends.push(user);
        // remove friend request
        user.friend_requests.pull(friend._id);
        // remove friend pending
        friend.friend_pendings.pull(user._id);
        // save change
        user.save();
        friend.save();

        callback(null, {
          user_id: friend._id,
          username: friend.username,
          fullname: friend.fullname,
        });
      });
    } else {
      callback(new Error('422'), {
        status_code: 422,
        success: false,
        status_message: 'Cannot find user friend.',
      });
    }
  });
}

function addFriend(userId, acceptedFriendId, callback) {
  userRepository.findById(userId, (err, user) => {
    if (err) {
      callback(err, {
        status_code: 422,
        success: false,
        status_message: err.message,
      });
    } else if (user.friends != null && user.friends.some(x => x.equals(acceptedFriendId))) {
      callback(new Error('422'), {
        status_code: 422,
        success: false,
        status_message: 'User already have this friend.',
      });
    } else {
      userRepository.findById(acceptedFriendId, (err, requestedFriend) => {
        if (err) {
          callback(err, {
            status_code: 422,
            success: false,
            status_message: err.message,
          });
        }
        user.friend_pendings.push(requestedFriend);
        requestedFriend.friend_requests.push(user);
        user.save();
        requestedFriend.save();

        callback(null, {
          friend_id: requestedFriend._id,
          username: requestedFriend.username,
          fullname: requestedFriend.fullname,
        });
      });
    }
  });
}

function getFriendLists(userId, callback) {
  userRepository.findById(userId)
    .populate({ path: 'friends', model: 'User', select: 'username fullname avatar_url' })
    .exec((err, user) => {
      if (err) {
        callback(err, {
          status_code: 422,
          success: false,
          status_message: err.message,
        });
      } else {
        callback(null, {
          friends: user.friends,
        });
      }
    });
}

function getFriendRequests(userId, callback) {
  userRepository.findById(userId)
    .populate({ path: 'friend_requests', model: 'User', select: 'username fullname avatar_url' })
    .exec((err, user) => {
      if (err) {
        callback(err, {
          status_code: 422,
          success: false,
          status_message: err.message,
        });
      } else {
        callback(null, {
          friend_requests: user.friend_requests,
        });
      }
    });
}

function getFriendPendings(userId, callback) {
  userRepository.findById(userId)
    .populate({ path: 'friend_pendings', model: 'User', select: 'username fullname avatar_url' })
    .exec((err, user) => {
      if (err) {
        callback(err, {
          status_code: 422,
          success: false,
          status_message: err.message,
        });
      } else if (user == null) {
        callback(new Error('422'), {
          status_code: 422,
          success: false,
          status_message: 'No user found.',
        });
      } else {
        callback(err, {
          friend_pendings: user.friend_pendings,
        });
      }
    });
}

function deleteFriend(userId, friendId, callback) {
  userRepository.findById(userId, (err, user) => {
    if (err) {
      callback(err, {
        status_code: 422,
        success: false,
        status_message: err.message,
      });
    } else if (user == null) {
      callback(new Error('422'), {
        status_code: 422,
        success: false,
        status_message: 'User not found.',
      });
    } else {
      const friends = user.friends;
      if (friends != null && friends.some(id => id.equals(friendId))) {
        userRepository.findById(friendId, (err, friend) => {
          if (err) {
            callback(err, {
              status_code: 422,
              success: false,
              status_message: err.message,
            });
          } else if (user == null) {
            callback(new Error('422'), {
              status_code: 422,
              success: false,
              status_message: 'No friend found.',
            });
          } else {
            user.friends = user.friends.filter(id => !id.equals(friendId));
            friend.friends = friend.friends.filter(id => !id.equals(userId));
            user.save();
            friend.save();

            callback(null, {
              status_code: 200,
              success: true,
              status_message: 'Delete friend successfully.',
            });
          }
        });
      } else {
        callback(new Error('422'), {
          status_code: 422,
          success: false,
          status_message: 'No friend to delete.',
        });
      }
    }
  });
}

function getFriend(userId, friendId, callback) {
  userRepository.findById(userId, (err, user) => {
    if (err) {
      callback(err, {
        status_code: 422,
        success: false,
        status_message: err.message,
      });
    } else if (user == null) {
      callback(new Error('422'), {
        status_code: 422,
        success: false,
        status_message: 'User not found.',
      });
    } else {
      const friends = user.friends;
      if (friends != null && friends.some(id => id.equals(friendId))) {
        userRepository.findById(friendId, (err, friend) => {
          if (err) {
            callback(err, {
              status_code: 422,
              success: false,
              status_message: err.message,
            });
          } else if (user == null) {
            callback(new Error('422'), {
              status_code: 422,
              success: false,
              status_message: 'No friend found.',
            });
          } else {
            callback(null, {
              friend_id: friend._id,
              username: friend.username,
              fullname: friend.fullname,
            });
          }
        });
      } else {
        callback(new Error('422'), {
          status_code: 422,
          success: false,
          status_message: 'No friend found.',
        });
      }
    }
  });
}

function deleteFriendRequest(userId, friendId, callback) {
  userRepository.findById(userId, (err, user) => {
    if (err) {
      callback(err, {
        status_code: 422,
        success: false,
        status_message: err.message,
      });
    } else if (user == null) {
      callback(new Error('422'), {
        status_code: 422,
        success: false,
        status_message: 'No friend found.',
      });
    } else {
      userRepository.findById(friendId, (err, friend) => {
        if (err) {
          callback(err, {
            status_code: 422,
            success: false,
            status_message: err.message,
          });
        } else if (friend == null) {
          callback(new Error('422'), {
            status_code: 422,
            success: false,
            status_message: 'No friend found.',
          });
        } else if (user.friend_requests.some(u => u.equals(friendId))) {
          user.friend_requests.pull(friendId); user.save();
          user.friend_pendings.pull(friendId); user.save();
          friend.friend_pendings.pull(userId); friend.save();
          friend.friend_requests.pull(userId); friend.save();
          callback(null, {
            status_code: 200,
            success: true,
            status_message: 'Delete friend request successfully.',
          });
        } else {
          callback(new Error('422'), {
            status_code: 422,
            success: false,
            status_message: 'Cannot find user in friend requests',
          });
        }
      });
    }
  });
}

function findFriends(userId, keyword) {
  return new Promise((resolve, reject) => {
    userRepository.find({ username: { $regex: `.*${keyword}.*` } })
      .select('username fullname avatar_url')
      .exec((error, friends) => {
        if (error) {
          reject(new Error(JSON.stringify({
            status_code: 422,
            success: false,
            status_message: error.message,
          })));
        } else {
          resolve({ friends });
        }
      });
  });
}

function findNearbyFriends(userId, radius = 0.001) {
  return new Promise((resolve, reject) => {
    userRepository.findById(userId)
      .select('latlng')
      .exec((error, user) => {
        if (error) {
          reject(new Error(JSON.stringify({
            status_code: 422,
            success: false,
            status_message: error.message,
          })));
        } else if (user.latlng.lat === undefined) {
          reject(new Error(JSON.stringify({
            status_code: 422,
            success: false,
            status_message: 'User doesn\'t have latlng',
          })));
        } else {
          userRepository.find({})
            .select('username fullname avatar_url')
            .where('latlng.lat')
            .gt(user.latlng.lat - radius)
            .lt(user.latlng.lat + radius)
            .where('latlng.lng')
            .gt(user.latlng.lng - radius)
            .lt(user.latlng.lng + radius)
            .exec((error, friends) => {
              if (error) {
                reject(new Error(JSON.stringify({
                  status_code: 422,
                  success: false,
                  status_message: error.message,
                })));
              } else {
                resolve({ friends: friends.filter(f => !f._id.equals(userId)) });
              }
            });
        }
      });
  });
}

module.exports = {
  acceptFriend,
  addFriend,
  getFriendLists,
  getFriendRequests,
  deleteFriend,
  getFriend,
  getFriendPendings,
  deleteFriendRequest,
  findFriends,
  findNearbyFriends,
};
