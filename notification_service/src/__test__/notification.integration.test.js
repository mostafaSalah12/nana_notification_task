const Hapi = require('@hapi/hapi')
const moment = require('moment')
const { Notification } = require('../models/notification')
const { init } = require('../server')
const { cleanDatabase } = require('./helper/database_cleanup')

jest.setTimeout(100000)

const user_ids = [
  '61d603fb8bcc7815a00df371',
  '61d60407c315627006a8285b',
  '61d604132359b82c479e528a',
]
const template_names = ['new_offer', 'happy_new_year', 'new_promotion']

describe('ensure notification api working', () => {
  let server = null
  beforeAll(async () => {
    server = await init(false)
  })

  afterAll(async () => {
    await server.stop()
    await cleanDatabase()
  })

  describe('Givien client sends notification to user with valid data', () => {
    it('sending email notification, it should returns "success" if user has email', async () => {
      const request = {
        user_id: user_ids[0],
        type: 'EMAIL',
        template_name: template_names[0],
      }

      const res = await server.inject({
        method: 'post',
        url: '/notification',
        payload: request,
      })

      expect(res.statusCode).toEqual(200)
      const payload = JSON.parse(res.payload)
      expect(payload.message).toEqual('Notification sent')

      const notification = await Notification.findOne({ _id: payload._id })

      expect(notification.notification_type).toEqual('EMAIL')
      expect(notification.notification_name).toEqual(template_names[0])
      expect(notification.user_id.toString()).toEqual(user_ids[0])
      expect(notification.status).toEqual('pending')

      //wait for notification to be sent
      await new Promise(r => setTimeout(r, 5000))

      const updated_notification = await Notification.findOne({
        _id: payload._id,
      })
      expect(updated_notification.status).toEqual('success')
    })

    it('sending sms notification, it should returns "success" if user has mobile', async () => {
      const request = {
        user_id: user_ids[1],
        type: 'SMS',
        template_name: template_names[1],
      }

      const res = await server.inject({
        method: 'post',
        url: '/notification',
        payload: request,
      })

      expect(res.statusCode).toEqual(200)
      const payload = JSON.parse(res.payload)
      expect(payload.message).toEqual('Notification sent')

      const notification = await Notification.findOne({ _id: payload._id })

      expect(notification.notification_type).toEqual('SMS')
      expect(notification.notification_name).toEqual(template_names[1])
      expect(notification.user_id.toString()).toEqual(user_ids[1])
      expect(notification.status).toEqual('pending')

      //wait for notification to be sent
      await new Promise(r => setTimeout(r, 5000))

      const updated_notification = await Notification.findOne({
        _id: payload._id,
      })
      expect(updated_notification.status).toEqual('success')
    })

    it('sending push notification, it should returns "success" if user has device token', async () => {
      const request = {
        user_id: user_ids[2],
        type: 'PUSH',
        template_name: template_names[2],
      }

      const res = await server.inject({
        method: 'post',
        url: '/notification',
        payload: request,
      })

      expect(res.statusCode).toEqual(200)
      const payload = JSON.parse(res.payload)
      expect(payload.message).toEqual('Notification sent')

      const notification = await Notification.findOne({ _id: payload._id })

      expect(notification.notification_type).toEqual('PUSH')
      expect(notification.notification_name).toEqual(template_names[2])
      expect(notification.user_id.toString()).toEqual(user_ids[2])
      expect(notification.status).toEqual('pending')

      //wait for notification to be sent
      await new Promise(r => setTimeout(r, 5000))

      const updated_notification = await Notification.findOne({
        _id: payload._id,
      })
      expect(updated_notification.status).toEqual('success')
    })

    it('sending email notification with delay 15 seconds, it should returns "success" after 15 seconds', async () => {
        const request = {
          user_id: user_ids[0],
          type: 'EMAIL',
          template_name: template_names[0],
          schedule_date: moment().add(15, 'seconds').toISOString()
        }
  
        const res = await server.inject({
          method: 'post',
          url: '/notification',
          payload: request,
        })
  
        expect(res.statusCode).toEqual(200)
        const payload = JSON.parse(res.payload)
        expect(payload.message).toEqual('Notification sent')
  
        //wait for 8 seconds
        await new Promise(r => setTimeout(r, 8000))
  
         let notification = await Notification.findOne({
          _id: payload._id,
        })
        expect(notification.status).toEqual('pending')

        //wait again for notification to be sent
        await new Promise(r => setTimeout(r, 9000))
  
         notification = await Notification.findOne({
          _id: payload._id,
        })
        expect(notification.status).toEqual('success')
      })
  })

  describe('Givien client sends notification to user with invalid data', () => {
    it('sending notification with not exisiting user id, it should returns user not found', async () => {
      const request = {
        user_id: '61d732eb2419cfa004aaea40',
        type: 'EMAIL',
        template_name: template_names[1],
      }

      const res = await server.inject({
        method: 'post',
        url: '/notification',
        payload: request,
      })

      expect(res.statusCode).toEqual(400)
      const payload = JSON.parse(res.payload)
      expect(payload.message).toEqual('user not found')
    })

    it('sending notification with not exisiting template name, it should returns no template found!', async () => {
      const request = {
        user_id: user_ids[1],
        type: 'EMAIL',
        template_name: 'not_exisiting_template',
      }

      const res = await server.inject({
        method: 'post',
        url: '/notification',
        payload: request,
      })
      expect(res.statusCode).toEqual(400)
      const payload = JSON.parse(res.payload)
      expect(payload.message).toEqual('no template found!')
    })

    it('sending notification with invalid type, it should returns "type" must be one of [SMS, EMAIL, PUSH]', async () => {
      const request = {
        user_id: user_ids[1],
        type: 'INVALID_TYPE',
        template_name: template_names[1],
      }

      const res = await server.inject({
        method: 'post',
        url: '/notification',
        payload: request,
      })
      expect(res.statusCode).toEqual(400)
      const payload = JSON.parse(res.payload)
      expect(payload.message).toEqual(
        '"type" must be one of [SMS, EMAIL, PUSH]'
      )
    })

    it('sending notification with invalid mongo id, it should returns "user_id" with value "1234" fails to match the valid mongo id pattern', async () => {
      const request = {
        user_id: '1234',
        type: 'INVALID_TYPE',
        template_name: template_names[1],
      }

      const res = await server.inject({
        method: 'post',
        url: '/notification',
        payload: request,
      })
      expect(res.statusCode).toEqual(400)
      const payload = JSON.parse(res.payload)
      expect(payload.message).toEqual(
        '"user_id" with value "1234" fails to match the valid mongo id pattern'
      )
    })
  })
})
