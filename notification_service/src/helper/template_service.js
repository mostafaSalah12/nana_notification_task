const mongoose = require('mongoose');
const Boom = require('@hapi/boom')
const { Template } = require('../models/template')

module.exports.addNewTemplate = async (new_template) => {
      const template = await new Template({...new_template}).save()
      return template
  }

module.exports.getTemplateByName = async (name) => {

    const template = await Template.findOne({name})
    if(!template){
        throw new Boom.badRequest(`no template found!`)
    }
    return template;
 
}

module.exports.getTemplateById = async (_id) => {
    if(!mongoose.Types.ObjectId.isValid(_id)){
        throw new Boom.badRequest('invalid id')
    }
    const template = await Template.findById({ _id })
    if(!template){
        throw new Boom.badRequest('template not found')  
    }
    return template

}

  //insert many templates
  module.exports.insertManyTemplates = async (template_list) => {
    const templates = await Template.insertMany(template_list)
    return templates
}

module.exports.getAllTemplates = async () => {
    const templates = await Template.find()
    return templates
}

