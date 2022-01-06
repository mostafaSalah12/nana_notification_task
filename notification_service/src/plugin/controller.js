const { Notification } = require('../models/notification')
const {getTemplateByName} = require('../helper/template_service')
const {getUserById} = require('../helper/user_service');
const { getRMQPChannel } = require('../util/rmqp_setup');
const {sendEmail, sendSMS, sendPushNotification, getScheduleMillisecondsFromDate} = require('./service')


module.exports.postNotification = async (request, h) => {
    const {user_id, type, template_name, schedule_date} = request.payload
    const user = await getUserById(user_id)
    const template = await getTemplateByName(template_name)
    const queueChannel = await getRMQPChannel()
    const new_notification = await new Notification({user_id, notification_type: type, notification_name:template_name, template_id: template._id,  }).save()
    let delay = 0
    if(schedule_date){
        // get the milliseconds from the date
        delay =  getScheduleMillisecondsFromDate(schedule_date)
    }   
    switch (type) {
        case 'EMAIL':
            await sendEmail(queueChannel, user, new_notification._id, template.file_name, delay)
            break;
        case 'SMS':
            await sendSMS(queueChannel, user, new_notification._id, template.file_name, delay)
            break;
        case 'PUSH':
            await sendPushNotification(queueChannel, user, new_notification._id, template.file_name, delay)
            break;
        default:
            break;
    }

    return h.response({
        message: "Notification sent",
        _id: new_notification._id
    }).code(200)
}

module.exports.getNotifications = async (request, h) => {
 
    const {rows, page, _id, user_id, status, notification_type } = request.query
    const search_query = countructQueryObject(_id, status, user_id, notification_type)
    
    const notification_count = await Notification.countDocuments().exec()
    const notifications = await Notification.find(search_query)
         .skip(rows * (page - 1))
         .limit(rows)
         .sort({
          createdAt: 1
         }).exec()
         return h.response({
             count: notification_count,
             data: notifications
         }).code(200)

}


function countructQueryObject (_id, status, user_id, notification_type){
    const search_query = {}
    if(_id){
        search_query._id = _id
    }
    if(status){
        search_query.status = status
    }
    if(user_id){
        search_query.user_id = user_id
    }
    if(notification_type){
        search_query.notification_type = notification_type
    }
    return search_query
}


