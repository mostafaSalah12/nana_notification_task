const mongoose = require('mongoose');
const Boom = require('@hapi/boom')
const { User } = require('../models/user')

module.exports.addNewUser = async (new_user) => {
      const user = await new User({...new_user}).save()
      return user
  }

  //insert many users
  module.exports.insertManyUsers = async (user_list) => {
      const users = await User.insertMany(user_list)
      return users
  }

module.exports.getGetUserByEmail = async (email) => {

    const user =  await User.findOne({email})
    if(!user){
        throw new Boom.notFound(`no user found!`)
    }
    return user;
}

module.exports.getUserById = async (_id) => {
    if(!mongoose.Types.ObjectId.isValid(_id)){
        throw new Boom.badRequest('invalid id')
    }
 
    const user = await User.findById({ _id })
    if(!user){
        throw new Boom.badRequest('user not found')  
    }
    return user
 
}

module.exports.getAllUsers = async () => {
    const users = await User.find()
    return users
}

