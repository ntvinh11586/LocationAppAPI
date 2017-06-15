const appointmentModel = require('../models/appointment');

module.exports = {
  addAppointment: payload =>
    appointmentModel.addAppointment(payload)
      .then((data) => {
        return {
          group_id: data.group,
          latlng: data.latlng,
          address: data.address,
          start_time: data.start_time,
          end_time: data.end_time,
        };
      }),
};
