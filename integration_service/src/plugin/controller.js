const Boom = require('@hapi/boom')
const { IntegrationLog } = require('../models/integration_log')

module.exports.getAllIntegrationLogs = async (request, h) => {
    const {rows, page, _id, user_id, status, notification_type } = request.query
    const search_query = countructQueryObject(_id, status, user_id, notification_type)
    const log_count = await IntegrationLog.countDocuments().exec()
    const logs = await IntegrationLog.find(search_query)
         .skip(rows * (page - 1))
         .limit(rows)
         .sort({
          createdAt: 1
         }).exec()

         if(logs.length === 0){
             throw new Boom.notFound('No logs found')
         }

         return h.response({
             count: log_count,
             data: logs
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