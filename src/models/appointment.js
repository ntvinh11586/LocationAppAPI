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

function readAppointmentByGroupId(groupId) {
  return new Promise((resolve, reject) => {
    appointmentRepository.find({ group: groupId })
      .exec((error, appointments) => {
        if (error) {
          reject(new Error(JSON.stringify({
            status_code: 422,
            success: false,
            status_message: error.message,
          })));
        } else {
          resolve(appointments);
        }
      });
  });
}

function deleteAppointmentById(appointmentId) {
  return new Promise((resolve, reject) => {
    appointmentRepository.findByIdAndRemove(appointmentId)
      .exec((error) => {
        if (error) {
          reject(new Error(JSON.stringify({
            status_code: 422,
            success: false,
            status_message: error.message,
          })));
        } else {
          resolve({
            status_code: 200,
            success: true,
            status_message: 'delete Appointment Successfully!',
          });
        }
      });
  });
}

module.exports = {
  addAppointment: payload =>
    createAppointment(payload),

  getAppointments: ({ groupId }) =>
    readAppointmentByGroupId(groupId),

  deleteAppointment: ({ appointmentId }) =>
    deleteAppointmentById(appointmentId),
};
