
const { EXCHANGE_NAME, EMAIL_ROUTING_KEY, SMS_ROUTING_KEY, PUSH_ROUTING_KEY } = require('../config/constants');
const moment = require('moment')

module.exports.sendEmail = async (channel, user, notification_id, template_file_name,
    delay) =>{
    const message = {
        user_id: user._id,
        full_name: user.full_name,
        email: user.email,
        notification_id: notification_id,
        template_file_name: template_file_name
    }
    await channel.publish(EXCHANGE_NAME, EMAIL_ROUTING_KEY, Buffer.from(JSON.stringify(message)), {persistent: true, headers: {"x-delay": delay}})
}

module.exports.sendSMS = async (channel, user, notification_id, template_file_name, delay) => {
   const message = {
        user_id: user._id,
        mobile: user.mobile,
        notification_id: notification_id,
        template_file_name: template_file_name
    }
    await channel.publish(EXCHANGE_NAME, SMS_ROUTING_KEY, Buffer.from(JSON.stringify(message)), {persistent: true, headers: {"x-delay": delay}})
}

module.exports.sendPushNotification = async (channel, user, notification_id, template_file_name, delay) => {
   const message = {
        user_id: user._id,
        device_token: user.device_token,
        notification_id: notification_id,
        template_file_name: template_file_name
    }
    await channel.publish(EXCHANGE_NAME, PUSH_ROUTING_KEY, Buffer.from(JSON.stringify(message)), {persistent: true, headers: {"x-delay": delay}})
}

module.exports.getScheduleMillisecondsFromDate = (schedule_date)=>{
    let now = moment.utc().valueOf()
    let schedule = moment.utc(schedule_date).valueOf() 
    return schedule - now
    
}