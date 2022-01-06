const amqp = require('amqplib')
const {
    RABBITMQ_URL,
    EXCHANGE_NAME,
    EMAIL_QUEUE,
    SMS_QUEUE,
    PUSH_QUEUE,
    EMAIL_ROUTING_KEY,
    SMS_ROUTING_KEY,
    PUSH_ROUTING_KEY, 
} = require('../config/constants')


let channel = null
async function getRMQPChannel(){
    if(!channel){
        try{
            
             connection = await amqp.connect(RABBITMQ_URL)
             channel = await  connection.createChannel()

             await channel.assertExchange(EXCHANGE_NAME, 'x-delayed-message', { durable: true, passive: true,  arguments: {'x-delayed-type':  "direct"}})
             await channel.assertQueue(EMAIL_QUEUE, { durable: true })
             await channel.assertQueue(SMS_QUEUE, { durable: true })
             await channel.assertQueue(PUSH_QUEUE, { durable: true })

            await channel.bindQueue(EMAIL_QUEUE, EXCHANGE_NAME, EMAIL_ROUTING_KEY)
            await channel.bindQueue(SMS_QUEUE, EXCHANGE_NAME, SMS_ROUTING_KEY)
            await channel.bindQueue(PUSH_QUEUE, EXCHANGE_NAME, PUSH_ROUTING_KEY)
                
        }catch(ex){
            console.error(ex)
        }
    }

    return channel
    
}

module.exports.getRMQPChannel = getRMQPChannel