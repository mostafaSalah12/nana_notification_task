const mongoose = require('mongoose')
const { User } = require('../../models/user')
const { Template } = require('../../models/template')
const { Notification } = require('../../models/notification')



module.exports.cleanDatabase = async ()=>{
   await User.deleteMany({})
   await Template.deleteMany({})
   await Notification.deleteMany({})
}
