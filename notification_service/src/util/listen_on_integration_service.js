const { Notification } = require('../models/notification')
const { STATUS_QUEUE } = require('../config/constants')
const { getRMQPChannel } = require('./rmqp_setup')

module.exports.listenOnIntegrationService = async () => {
    const channel = await getRMQPChannel()
    const status = await channel.assertQueue(STATUS_QUEUE, {durable: true})

    channel.consume(status.queue, message=>{
            const {_id}  = JSON.parse(message.content.toString())

                Notification.findOneAndUpdate({ _id }, {$set:{ status: message.fields.routingKey }}, {new: true})
                .then(({ _id }) =>{
                    console.log(`notification with id ${_id} status updated to `, message.fields.routingKey)
                })
                .catch(err=>{
                    console.error(err)
                })
            channel.ack(message)
        }, {
            noAck: false
          })
    
}