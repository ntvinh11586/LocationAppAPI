const appointmentRepository = require('../repositories/appointment');

function createAppointment({ groupId, address, latlng, startTime, endTime }) {
  return new Promise((resolve, reject) => {
    appointmentRepository.create(
      { group: groupId, address, latlng, start_time: startTime, end_time: endTime },
      (error, appointment) => {
        if (error) {
          reject(new Error(JSON.stringify({
            status_code: 422,
            success: false,
            status_message: error.message,
          })));
        } else {
          resolve(appointment);
        }
      });
  });
}

module.exports = {
  addAppointment: payload =>
    createAppointment(payload),
};
