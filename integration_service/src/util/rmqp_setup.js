const amqp = require("amqplib");
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
             channel = await  connection.createChannel();
    
        }catch(ex){
            console.error(ex)
        }
    }

    return channel
    
}

module.exports.getRMQPChannel = getRMQPChannel