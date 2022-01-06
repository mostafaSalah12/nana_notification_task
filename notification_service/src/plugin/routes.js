const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const {
  getNotifications,
  postNotification
} = require('./controller')

module.exports = function (server) {
  server.route({
    method: 'POST',
    path: '/notification',
    options: {
      tags: ['api', 'Notification'],
      validate: {
        payload: Joi.object({
          user_id: Joi.objectId().required().description('User Id').messages({
            'any.required': 'User Id is required',
          }),
          type: Joi.string().valid('SMS', 'EMAIL', 'PUSH').required().messages({
            'string.valid': 'Type should be SMS, EMAIL or PUSH',
            'any.required': 'Notification type is required',
          }),
          template_name: Joi.string().required().messages({
            'any.required': 'Template name is required',
          }),
          schedule_date: Joi.date().greater('now').optional().messages({
            'date.greater': 'Schedule date should be greater than current date',
          }),
        }),
      },
    },
    handler: postNotification,
  })

  server.route({
    method: 'GET',
    path: '/notification',
    options: {
      auth: false,
      tags: ['api', 'Notification'],
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          rows: Joi.number().integer().min(1).default(10),
          user_id: Joi.objectId().optional(),
          _id: Joi.objectId().optional(),
          notification_type: Joi.string()
            .valid('SMS', 'EMAIL', 'PUSH')
            .optional(),
          status: Joi.string()
            .valid('pending', 'success', 'failed')
            .optional(),
        }),
      },
    },
    handler: getNotifications,
  })
}
