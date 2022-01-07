'use strict'
const Hapi = require('@hapi/hapi')
const { connectDB } = require('./config/mongo')
const HapiSwagger = require('hapi-swagger')
const Inert = require('@hapi/inert')
const Pino = require('hapi-pino')
const Vision = require('@hapi/vision')
const handleValidationError = require('./util/global-validation-handler')
const { migrateDatabase } = require('./util/migrate_database')
const {
  listenOnIntegrationService,
} = require('./util/listen_on_integration_service')
const { version } = require('../package.json')
const NotificationPlugin = require('./plugin')

const swaggerOptions = {
  info: {
    title: 'Nana Notification Documentation',
  },
}
const init = async logging => {
  await connectDB()
  await migrateDatabase()
  await listenOnIntegrationService()
  const server = Hapi.server({
    port: 3000,
    routes: {
      validate: {
        failAction: handleValidationError,
      },
    },
  })
  await server.register(Vision)
  const plugins = [
    { plugin: Inert },
    { plugin: HapiSwagger, options: swaggerOptions },
    {
      plugin: Pino,
      options: {
        level: logging === false ? 'silent' : 'debug',
        mergeHapiLogData: true,
        messageKey: 'message',
        prettyPrint: true,
      },
    },
    { plugin: NotificationPlugin },
  ]

  await server.register(plugins)
  return server
}

const start = async () => {
  const server = await init()

  process.on('SIGINT', () => {
    server.log(['info', 'stop'], 'SIGINT: stopping server...')
    server.stop({ timeout: 10000 }).then(() => {
      server.log(['info', 'stop'], 'server stopped')
    })
  })

  await server.start()
  server.log(['info', 'start'], {
    message: `servr v${version} `,
    version,
  })
  return server
}

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})

module.exports = {
  init,
  start,
}
