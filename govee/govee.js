process.NOBLE_REPORT_ALL_HCI_EVENTS = "1";

const govee = require('govee-bt-client');
const mqtt = require('mqtt')

const options_connect = {
  will: {
    topic: "tele/Govee/LWT",
    payload: "Offline",
    retain: true
  }
};

const mqtt_client = mqtt.connect('mqtt://localhost', options_connect);
mqtt_client.publish('tele/Govee/LWT', 'Online');

govee.startDiscovery((reading) => {
  // console.log(reading);

  // {
  //   uuid: 'e36058e0f064',
  //   address: 'e3:60:58:e0:f0:64',
  //   model: 'Govee_H5074_F064',
  //   battery: 85,
  //   humidity: 33.31,
  //   tempInC: 7.97,
  //   tempInF: 46.346000000000004,
  //   rssi: -64
  // }

  const prefix = 'stat';
  mqtt_client.publish(`${prefix}/${reading.model}/temperature`, reading.tempInC.toString());
  mqtt_client.publish(`${prefix}/${reading.model}/humidity`, reading.humidity.toString());
  mqtt_client.publish(`${prefix}/${reading.model}/battery`, reading.battery.toString());
  mqtt_client.publish(`${prefix}/${reading.model}/rssi`, reading.rssi.toString());

});

process.on('SIGINT', function () {
  console.log('Caught interrupt signal');
  process.exit();
});

process.on('SIGQUIT', function () {
  console.log('Caught interrupt signal');
  process.exit();
});

process.on('SIGTERM', function () {
  console.log('Caught interrupt signal');
  process.exit();
});
