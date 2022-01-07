const path = require('path')
const fs = require('fs')

const BASE_TEMPLATES_PATH = path.join(process.env.PWD, 'src', 'templates')

module.exports.getTemplateByFileName = file_name => {
  file_path = path.join(BASE_TEMPLATES_PATH, file_name)
  return new Promise((resolve, reject) => {
    fs.access(file_path, fs.constants.F_OK, error => {
      if (!error) {
        const content = fs.readFileSync(file_path, 'utf8')
        resolve(content)
      }
      reject('template not found!')
    })
  })
}
