const userModel = require('../models/user');
const groupModel = require('../models/group');

module.exports = {
  updateAvatar: (userId, avatarUrl) =>
    userModel.updateAvatar(userId, avatarUrl),

  getGroupRequests: userId =>
    userModel.getGroupRequestsByUserId(userId)
      .then((data) => {
        return {
          user_id: data._id,
          group_requests: data.group_requests,
        };
      }),

  acceptGroupRequest: ({ userId, groupId }) =>
    userModel.removeGroupRequestByUserId({ userId, groupId })
      .then(() => groupModel.addAcceptedMember({ userId, groupId })),

  declineGroupRequest: ({ userId, groupId }) =>
    userModel.removeGroupRequestByUserId({ userId, groupId })
      .then(() => {
        return {
          status_code: 200,
          success: true,
          status_message: 'Delete group request successfully.',
        };
      }),
};
