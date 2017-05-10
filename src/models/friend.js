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
        friend.friends_pending.pull(user._id);
        // save change
        user.save();
        friend.save();

        callback(null, {
          user_id: friend._id,
          username: friend.username,
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
        user.friends_pending.push(requestedFriend);
        requestedFriend.friend_requests.push(user);
        user.save();
        requestedFriend.save();

        callback(null, {
          friend_id: requestedFriend._id,
          username: requestedFriend.username,
        });
      });
    }
  });
}

function getFriendLists(userId, callback) {
  userRepository.findById(userId).populate('users').exec((err, user) => {
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
  userRepository.findById(userId).populate('users').exec((err, user) => {
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

function getFriendPendings(userId, callback) {
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
        status_message: 'No user found.',
      });
    } else {
      callback(err, {
        friend_pendings: user.friends_pending,
      });
    }
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
};
