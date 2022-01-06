const mongoose = require('mongoose')
const Schema = mongoose.Schema

var IntegrationLogSchema = new Schema({
  notification_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  notification_type: {
    type: String,
    enum: ['EMAIL', 'SMS', 'PUSH'],
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
  },
  template_file_name: {
    type: String,
    required: true
  }, 
  status: {
    type: String,
    enum: [ 'SUCCESSED', 'FAILED']
  }
},
{
  timestamps: true,
})




module.exports.IntegrationLog = mongoose.model('IntegrationLog', IntegrationLogSchema);