const {getScheduleMillisecondsFromDate} = require('./src/plugin/service')


const result = getScheduleMillisecondsFromDate(moment().add(1, 'minutes').toISOString())

console.log(result/1000)