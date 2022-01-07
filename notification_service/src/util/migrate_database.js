const mongoose = require('mongoose')
const { insertManyUsers, getAllUsers } = require('../helper/user_service')
const {
  insertManyTemplates,
  getAllTemplates,
} = require('../helper/template_service')

const users = [
  {
    _id: mongoose.Types.ObjectId('61d603fb8bcc7815a00df371'),
    full_name: 'Ahmed Mohammed',
    email: 'ahmed.mo@yahoo.com',
    mobile: '+203331234567',
    device_token: '123456789',
  },
  {
    _id: mongoose.Types.ObjectId('61d60407c315627006a8285b'),
    full_name: 'Mohammed Ahmed',
    email: 'mo.ahmed@yahoo.com',
    mobile: '+203331234567',
    device_token: '123456789',
  },
  {
    _id: mongoose.Types.ObjectId('61d604132359b82c479e528a'),
    full_name: 'Sara Ahmed',
    email: 'sara.ahmed@yahoo.com',
    mobile: '+203331234567',
    device_token: '123456789',
  },
]

const templates = [
  {
    _id: new mongoose.Types.ObjectId('61d6017c2552125e90b10907'),
    name: 'happy_new_year',
    file_name: 'happy_new_year',
  },
  {
    _id: new mongoose.Types.ObjectId('61d60199a6e974e849555e96'),
    name: 'new_offer',
    file_name: 'new_offer',
  },

  {
    _id: new mongoose.Types.ObjectId('61d601d17be36c88217c240a'),
    name: 'new_promotion',
    file_name: 'new_promotion',
  },
]

module.exports.migrateDatabase = async () => {
  const exisiting_users = await getAllUsers()
  if (exisiting_users.length === 0) {
    await insertManyUsers(users)
  }

  const exisiting_templates = await getAllTemplates()
  if (exisiting_templates.length === 0) {
    await insertManyTemplates(templates)
  }
}
