module.exports.mockSendEmail = (email, content) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`email sent to ${email} `)
      resolve('email sent')
    }, 2000)
  })
}

module.exports.mockSendSMS = (mobile, content) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`sms sent `)
      resolve('email sent')
    }, 2000)
  })
}

module.exports.mockSendPushNotification = (email, device_token) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`push notification sent `)
      resolve('email sent')
    }, 2000)
  })
}
