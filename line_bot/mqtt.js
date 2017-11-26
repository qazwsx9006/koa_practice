const mqtt = require('mqtt')
const config = require('../config/config');
const client  = mqtt.connect(config.mqttUrl)

function sentMqttToMe(publisg_data){
  console.log(`mqtt: ${publisg_data}`)
  client.publish(config.topic, publisg_data)  
}

// client.on('connect', function () {
//   client.subscribe('$SYS/broker/clients/active')
// })

// client.on('message', function (topic, message) {
//   // message is Buffer
//   console.log(`${new Date()} ${topic}: ${message.toString()}`)
//   // client.end()
// })

// sentMqttToMe('https://www.facebook.com')

module.exports = sentMqttToMe;