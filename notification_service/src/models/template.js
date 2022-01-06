const mongoose = require('mongoose')
const Schema = mongoose.Schema

var TemplateSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  file_name: {
    type: String,
    required: true,
  },
  is_deleted: {
    type: Boolean,
    default:false
  }
},
{
  timestamps: true,
})




module.exports.Template = mongoose.model('Template', TemplateSchema);