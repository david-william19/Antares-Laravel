var mqtt = require('mqtt');
var client = mqtt.connect("mqtt://mqtt.antares.id");
const http = require('http');
const { default: axios } = require('axios');
const express = require('express');
const { send } = require('process');
const app = express();
const port = 4123;

var settings = {
    port: 1883
}
var topic = "/oneM2M/resp/antares-cse/{{ACCESS-KEY-HERE}}/json"

var messageCounter = 0;

client.on('connect', function () {
    console.log("Broker Ready");
    client.subscribe(topic)
})

client.on('message', function (topic, message) {
    context = message.toString();
    const obj1 = JSON.parse(context);

    //get-dataAntares
    const dataAntares = obj1["m2m:rsp"]["pc"]["m2m:cin"]["con"]
    const obj2 = JSON.parse(dataAntares);
    //const resDataAntares = obj2.data

    //get-antaresId
    const dataPi = obj1["m2m:rsp"]["pc"]["m2m:cin"]["pi"]
    const piDevices = dataPi.split('cnt-')[1];


    if (piDevices) {
        messageCounter++;
        dataParse = JSON.parse(dataAntares)
        console.log('hasil', dataParse)
        if(dataParse.type === 'uplink'){
            axios.post('http://127.0.0.1:8000/api/mqtt', dataAntares, {headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }}).then(res => {
                console.log(res.status)
            }).catch(err => {
                console.log(err)
            })
        }
    }
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/downlink/:status', (req, res) => {
    const payload = {
        status: req.params.status
    }
    let url = 'https://platform.antares.id:8443/~/antares-cse/antares-id/WorkshopAntares/SmartSwitchStatus';
    let headers = {
      'X-M2M-Origin': '{{ACCESS-KEY-HERE}}',
      'Content-Type': 'application/json;ty=4',
      'Accept': 'application/json'
    };
    let body = {
      'm2m:cin': {
        'con': '{"type":"downlink","data":"'+payload.status+'","fport": 10}'
      }
    };
    result = axios.post(url, body, {headers: headers
        }).then(res => {
            console.log(res.status)
        }).catch(err => {
            console.log(err)
        })
    res.send(result)  
})
  
app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
