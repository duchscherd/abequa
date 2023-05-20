const mqtt = require('mqtt')
const APM = require('prometheus-middleware')

const mqtt_client = mqtt.connect('mqtt://192.168.1.111')

const apm = new APM()
apm.init();

mqtt_client.on('connect', function () {
    mqtt_client.subscribe('stat/#', function (err) {
        if (err) {
            console.log(err.message);
            apm.destroy();
            mqtt_client.end();
        }
    })
    mqtt_client.subscribe('tele/#', function (err) {
        if (err) {
            console.log(err.message);
            apm.destroy();
            mqtt_client.end();
        }
    })
})

let gauges = {
    temperature:
        new apm.client.Gauge({
            name: 'temperature_sensor',
            help: 'Temperature Sensor',
            labelNames: ['name']
        }),
    humidity:
        new apm.client.Gauge({
            name: 'humidity_sensor',
            help: 'Humidity Sensor',
            labelNames: ['name']
        }),
    battery:
        new apm.client.Gauge({
            name: 'battery_level',
            help: 'Battery Level',
            labelNames: ['name']
        }),
    rssi:
        new apm.client.Gauge({
            name: 'rssi',
            help: 'Received signal strength indicator',
            labelNames: ['name']
        }),
    load_average:
        new apm.client.Gauge({
            name: 'load_average',
            help: 'System load average',
            labelNames: ['name']
        })
}

mqtt_client.on('message', function (topic, message) {
    let [root, name, object] = topic.split("/");

    if (topic.startsWith("tele/tasmota_")) {
        if (object === "STATE") {
            let state = JSON.parse(message.toString());
            gauges['rssi'].set({ name: name }, state.Wifi.RSSI);
            gauges['load_average'].set({ name: name }, state.LoadAvg);
        }
    }

    if (topic.startsWith("stat/Govee_H5074_") === true) {
        gauges[object].set({ name: name }, Number(message.toString()));
    }
})

process.on('SIGINT', function () {
    console.log('Caught interrupt signal');
    apm.destroy();
    mqtt_client.end();
});

process.on('SIGQUIT', function () {
    console.log('Caught interrupt signal');
    apm.destroy();
    mqtt_client.end();
});

process.on('SIGTERM', function () {
    console.log('Caught interrupt signal');
    apm.destroy();
    mqtt_client.end();
});