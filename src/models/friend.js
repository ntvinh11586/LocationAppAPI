const userRepository = require('../repositories/user');

function acceptFriend(userId, acceptedFriendId, callback) {
  userRepository.findById(userId, (err, user) => {
    if (err) {
      callback(err, { err: 'error' });
    }
    if (user.friend_requests.some(x => x.equals(acceptedFriendId))) {
      userRepository.findById(acceptedFriendId, (err, friend) => {
        if (err) {
          callback(err, { err: 'error' });
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
          _id: friend._id,
          username: friend.username,
        });
      });
    } else {
      callback(err, { err: 'error' });
    }
  });
}

function addFriend(userId, acceptedFriendId, callback) {
  userRepository.findById(userId, (err, user) => {
    if (err) {
      callback(err, { err: 'error' });
    } else if (user.friends.some(x => x.equals(acceptedFriendId))) {
      callback(err, { err: 'already friend' });
    } else {
      userRepository.findById(acceptedFriendId, (err, requestedFriend) => {
        if (err) {
          callback(err, { err: 'error' });
        }
        user.friends_pending.push(requestedFriend);
        user.save();
        requestedFriend.friend_requests.push(user);
        requestedFriend.save();
        callback(null, {
          _id: requestedFriend._id,
          username: requestedFriend.username,
        });
      });
    }
  });
}

function getFriendLists(userId, callback) {
  userRepository.findById(userId).populate('users').exec((err, user) => {
    callback(null, { friend_list: user.friends });
  });
}

function getFriendRequests(userId, callback) {
  userRepository.findById(userId).populate('users').exec((err, user) => {
    callback(null, { friend_requests: user.friend_requests });
  });
}

function deleteFriend(userId, friendId, callback) {
  userRepository.findById(userId, (err, user) => {
    if (err) {
      callback(err, { err: 'err' });
    } else if (user == null) {
      callback(null, { err: 'user not found' });
    } else {
      const friends = user.friends;
      if (friends != null && friends.some(id => id.equals(friendId))) {
        user.friends = friends.filter(id => !id.equals(friendId));
        user.save();
        callback(null, { message: 'Delete friend successfully' });
      } else {
        callback(null, { err: 'no friend' });
      }
    }
  });
}

module.exports = {
  acceptFriend,
  addFriend,
  getFriendLists,
  getFriendRequests,
  deleteFriend,
};
