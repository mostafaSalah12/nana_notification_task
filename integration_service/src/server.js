
'use strict'
const Hapi = require('@hapi/hapi');
const {connectDB} = require('./config/mongo');
const HapiSwagger = require('hapi-swagger');
const Inert = require('@hapi/inert');
const Pino = require('hapi-pino');
const Vision = require('@hapi/vision');
const IntegrationLogsPlugin = require('./plugin')
const {handleSendNotification} = require('./plugin/service')

const swaggerOptions = {
    info:{
        title:'Nana Intgration Service Documentation'
    }
}

const init = async (logging) => {
    await connectDB()
    await handleSendNotification()

    const server = Hapi.server({
        port: 3001
    });
    await server.register(Vision);
    const plugins = [
        { plugin: Inert },
        {plugin: HapiSwagger,
        options: swaggerOptions },
    {
        plugin: Pino,
        options:{
            level: logging === false ? 'silent' : 'debug',
            mergeHapiLogData: true,
            messageKey:'message',
            prettyPrint: true
        }
    },
    { plugin: IntegrationLogsPlugin }
    ]

    await server.register(plugins);
    return server
};

const start = async ()=>{
    const server = await init()

    process.on('SIGINT', ()=>{
        server.log(['info', 'stop'], 'SIGINT: stopping server...')
        server.stop({timeout: 10000 }).then(()=>{
            server.log(['info', 'stop'], 'server stopped');
        });
    });

    await server.start()

 return server;
}

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

module.exports = {
    init,
    start
}
