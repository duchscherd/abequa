# Docker Setup

## Govee

This a node application written by me that listens for the Govee temperature sensors announcements, decodes them, and then sends the data to MQTT.

## Grafana

[Grafana](https://grafana.com) instance for visualizing data and alerting on events.

## Homebridge

Homebridge provides link to Apple's HomeKit. I currently only use a single plugin, [Homebridge MQTTThing](https://github.com/arachnetech/homebridge-mqttthing#readme).

## Mosquitto

MQTT software.

## Mqtt-Prom

This is a node application written by me that gateways MQTT topics to prometheus.

## Prometheus

[Prometheus](https://prometheus.io) time series data collector.