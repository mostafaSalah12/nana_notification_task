const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const {
getAllIntegrationLogs
} = require('./controller')

module.exports = function (server) {
  server.route({
    method: 'GET',
    path: '/logs',
    options: {
      auth: false,
      tags: ['api','Logs'],
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          rows: Joi.number().integer().min(1).default(10),
          user_id: Joi.objectId().optional(),
          _id: Joi.objectId().optional(),
          notification_type: Joi.string()
            .valid('SMS', 'EMAIL', 'PUSH')
            .optional()
            .messages({
              'string.valid': 'Type should be SMS, EMAIL or PUSH',
            }),
          status: Joi.string()
            .valid('SUCCESSED', 'FAILED')
            .optional()
            .messages({
              'string.valid': 'Status should be SUCCESSED or FAILED',
            }),
        }),
      },
    },
    handler: getAllIntegrationLogs,
  })  
}