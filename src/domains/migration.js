const groupModel = require('../models/group');

module.exports = {
  migrateFromGroupToRouteModel(groupId) {
    groupModel.migrateFromGroupToRouteModel(groupId);
  },

  migrateFromRouteToGroupModel(groupId) {
    groupModel.migrateFromRouteToGroupModel(groupId);
  },
};
