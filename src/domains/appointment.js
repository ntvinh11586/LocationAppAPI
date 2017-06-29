const appointmentModel = require('../models/appointment');

module.exports = {
  addAppointment: payload =>
    appointmentModel.addAppointment(payload)
      .then((data) => {
        return {
          appointment_id: data._id,
          group_id: data.group,
          latlng: data.latlng,
          address: data.address,
          start_time: data.start_time,
          end_time: data.end_time,
        };
      }),

  getAppointments: payload =>
    appointmentModel.getAppointments(payload)
      .then((data) => {
        return {
          group_id: payload.groupId,
          appointments: data,
        };
      }),

  deleteAppointment: payload =>
    appointmentModel.deleteAppointment(payload)
      .then(() => {
        return {
          group_id: payload.groupId,
          appointment_id: payload.appointmentId,
        };
      }),

  addUserToAppointment: payload =>
    appointmentModel.addUserToAppointment(payload)
      .then(() => {
        return {
          group_id: payload.groupId,
          appointment_id: payload.appointmentId,
          user_id: payload.userId,
        };
      }),

  deleteUserFromAppointment: payload =>
    appointmentModel.deleteUserFromAppointment(payload)
      .then(() => {
        return {
          group_id: payload.groupId,
          appointment_id: payload.appointmentId,
          user_id: payload.userId,
        };
      }),
};
