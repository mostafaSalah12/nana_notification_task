const mongoose = require('mongoose')
const Schema = mongoose.Schema

var UserSchema = new Schema({
  full_name: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  mobile: {
    type: String
  },
  device_token:String,
 
  is_deleted: {
    type: Boolean,
    default:false
  }
},
{
  timestamps: true,
})




module.exports.User = mongoose.model('User', UserSchema);