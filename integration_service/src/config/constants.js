
const RABBITMQ_HOST = process.env.IS_DOCKER ? process.env.RABBITMQ_URL : 'localhost'
module.exports.EXCHANGE_NAME = 'notifications'
module.exports.RABBITMQ_URL = `amqp://${RABBITMQ_HOST}:5672`
module.exports.EXCHANGE_NAME = process.env.EXCHANGE_NAME || 'notifications'
module.exports.EMAIL_QUEUE = 'notifications.email'
module.exports.SMS_QUEUE = 'notifications.sms'
module.exports.PUSH_QUEUE = 'notifications.push'
module.exports.EMAIL_ROUTING_KEY = 'email'
module.exports.SMS_ROUTING_KEY = 'sms'
module.exports.PUSH_ROUTING_KEY = 'push'
module.exports.STATUS_QUEUE = 'notifications.status'
module.exports.STATUS_SUCCESS_ROUTE = 'success'
module.exports.STATUS_FAILED_ROUTE = 'failed'

