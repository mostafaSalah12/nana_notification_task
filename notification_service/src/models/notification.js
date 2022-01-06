const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var NotificationSchema = new Schema({
  notification_type: {
    type: String,
    enum: ['EMAIL', 'SMS', 'PUSH'],
    required: true
  },
  notification_name: {
    type: String,
    required: true
  },
  template_id: {
    type: Schema.Types.ObjectId,
    ref:'Template',
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref:'User',
    required: true
  },
  
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },   
  is_deleted: {
    type: Boolean,
    default:false
  }
},
{
  timestamps: true,
})




module.exports.Notification = mongoose.model('Notification', NotificationSchema);