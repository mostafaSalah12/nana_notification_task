const amqp = require('amqplib')
const {
  RABBITMQ_URL
} = require('../config/constants')

let channel = null
async function getRMQPChannel() {
  if (!channel) {
    try {
      connection = await amqp.connect(RABBITMQ_URL)
      channel = await connection.createChannel()
    } catch (ex) {
      console.error(ex)
    }
  }

  return channel
}

module.exports.getRMQPChannel = getRMQPChannel
