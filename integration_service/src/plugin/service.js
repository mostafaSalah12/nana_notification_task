const handlebars = require('handlebars')
const { IntegrationLog } = require('../models/integration_log')
const { getRMQPChannel } = require('../util/rmqp_setup')
const { getTemplateByFileName } = require('../util/templates_processor')
const {
  mockSendSMS,
  mockSendPushNotification,
  mockSendEmail,
} = require('../util/mock_integrariont_with_providers')
const {
  EXCHANGE_NAME,
  EMAIL_QUEUE,
  SMS_QUEUE,
  PUSH_QUEUE,
  EMAIL_ROUTING_KEY,
  SMS_ROUTING_KEY,
  PUSH_ROUTING_KEY,
  STATUS_QUEUE,
  STATUS_SUCCESS_ROUTE,
  STATUS_FAILED_ROUTE,
} = require('../config/constants')

module.exports.handleSendNotification = async () => {
  const channel = await getRMQPChannel()

  // register exchange
  await channel.assertExchange(EXCHANGE_NAME, 'x-delayed-message', { durable: true, passive: true,  arguments: {'x-delayed-type':  "direct"}})

  // listen to the queues
  const email = await channel.assertQueue(EMAIL_QUEUE, { durable: true }),
        sms =   await channel.assertQueue(SMS_QUEUE, { durable: true }),
        push =  await channel.assertQueue(PUSH_QUEUE, { durable: true })
                await channel.assertQueue(STATUS_QUEUE, { durable: true })
  //bind queues to exchange
  await bindQueuesToExchange(channel, email, sms, push)

  // make sure I receive only one message at a time
  channel.prefetch(1)

  //listen on email notification queue
  await listenOnEmailQueue(channel, email)
  //listen on sms notification queue
  await listenOnSMSQueue(channel, sms)
  //listen on push notification queue
  await listenOnPushQueue(channel, push)
}

async function bindQueuesToExchange(channel, email, sms, push){
    await channel.bindQueue(email.queue, EXCHANGE_NAME, EMAIL_ROUTING_KEY, {
        durable: true,
      })
      await channel.bindQueue(sms.queue, EXCHANGE_NAME, SMS_ROUTING_KEY, {
        durable: true,
      })
      await channel.bindQueue(push.queue, EXCHANGE_NAME, PUSH_ROUTING_KEY, {
        durable: true,
      })
      await channel.bindQueue(STATUS_QUEUE, EXCHANGE_NAME, STATUS_SUCCESS_ROUTE, {
        durable: true,
      })
      await channel.bindQueue(STATUS_QUEUE, EXCHANGE_NAME, STATUS_FAILED_ROUTE, {
        durable: true,
      })
    
}

async function listenOnEmailQueue(channel, email){
    channel.consume(
        email.queue,
        async message => {
          const { user_id, email, full_name, template_file_name, notification_id } =
           JSON.parse(message.content.toString())
         
          try {
            // call send email provider
            await sendEmail({
              email,
              full_name,
              template_file_name,
              notification_id,
            })
            // save the notification in log with status success
            await new IntegrationLog({
              template_file_name: template_file_name,
              notification_type: 'EMAIL',
              notification_id,
              user_id,
              status: 'SUCCESSED',
            }).save()

            // publish success message
            channel.publish(
              EXCHANGE_NAME,
              STATUS_SUCCESS_ROUTE,
              Buffer.from(JSON.stringify({ _id: notification_id })),
              { persistent: true }
            )
          } catch (err) {
            // save the notification in log with error state
            await new IntegrationLog({
              template_file_name: template_file_name,
              notification_type: 'EMAIL',
              notification_id,
              user_id,
              status: 'FAILED',
            }).save()

            // publish failed message to notification service
            channel.publish(
              EXCHANGE_NAME,
              STATUS_FAILED_ROUTE,
              Buffer.from(JSON.stringify({ _id: notification_id })),
              { persistent: true }
            )
            console.error(err)
          }
          channel.ack(message)
        },
        {
          noAck: false,
        }
      )
}

async function listenOnSMSQueue(channel, sms){
    channel.consume(
        sms.queue,
        async message => {
          const { user_id, mobile, template_file_name, notification_id } =
            JSON.parse(message.content.toString())
          try {
            await sendSMS({ mobile, template_file_name })

            // save the notification in log with status success
            await new IntegrationLog({
              template_file_name: template_file_name,
              notification_type: 'SMS',
              status: 'SUCCESSED',
              notification_id,
              user_id,
            }).save()

            // publish success message
            channel.publish(
              EXCHANGE_NAME,
              'success',
              Buffer.from(JSON.stringify({ _id: notification_id })),
              { persistent: true }
            )
          } catch (err) {

            // save the notification in log with error state
            await new IntegrationLog({
              template_file_name: template_file_name,
              notification_type: 'SMS',
              notification_id,
              user_id,
              status: 'FAILED',
            }).save()

            // publish failed message to notification service
            channel.publish(
              EXCHANGE_NAME,
              STATUS_FAILED_ROUTE,
              Buffer.from(JSON.stringify({ _id: notification_id})),
              { persistent: true }
            )
            console.error(err)
          }
          channel.ack(message)
        },
        {
          noAck: false,
        }
      )
}

async function listenOnPushQueue(channel, push){
    channel.consume(
        push.queue,
        async message => {
          const { user_id, device_token, template_file_name, notification_id } =
            JSON.parse(message.content.toString())
          try {
            await { device_token, template_file_name }
            // send push notification to provider
            await sendPushNotification({ device_token, template_file_name })

            // save the notification in log with status success
            await new IntegrationLog({
              template_file_name: template_file_name,
              notification_type: 'PUSH',
              notification_id,
              user_id,
              status: 'SUCCESSED',
            }).save()
            // publish success message
            channel.publish(
              EXCHANGE_NAME,
              'success',
              Buffer.from(JSON.stringify({ _id: notification_id })),
              { persistent: true }
            )
          } catch (err) {
            // save the notification in log with error state  
            await new IntegrationLog({
              template_file_name: template_file_name,
              notification_type: 'PUSH',
              notification_id,
              user_id,
              status: 'FAILED',
            }).save()

            // publish failed message to notification service
            channel.publish(
              EXCHANGE_NAME,
              STATUS_FAILED_ROUTE,
              Buffer.from(JSON.stringify({ _id: notification_id })),
              { persistent: true }
            )
            console.error(err)
          }
          channel.ack(message)
        },
        {
          noAck: false,
        }
      )
}

async function sendEmail(notification_message) {
  const { full_name, email, template_file_name } = notification_message
  //get template
  const html = await getTemplateByFileName(`${template_file_name}.html`)
  //compile the html template with handlebars
  const template = handlebars.compile(html)
  // replace template variables
  const replacements = { name: full_name }
  const message = template(replacements)
  console.log(message)
  //send email
  return await mockSendEmail(email, message)
}

async function sendSMS(notification_message) {
  const { mobile, template_file_name } = notification_message
  //get content from template
  const message = await getTemplateByFileName(`${template_file_name}.sms.txt`)
  //send sms
  return await mockSendSMS(mobile, message)
}

async function sendPushNotification(notification_message) {
  const { device_token, template_file_name } = notification_message
  //get content from template
  const message = await getTemplateByFileName(`${template_file_name}.txt`)
  //send push notification
  return await mockSendPushNotification(device_token, message)
}
