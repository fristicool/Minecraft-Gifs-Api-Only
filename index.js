const request = require('request');
const express = require('express');
const app = express();
const server = require('http').createServer(app)
const WebSocket = require('ws');

const wss = new WebSocket.Server({ server:server });

const API_KEY = 'jEcmFUpzZFnioiuyze2S4TerUnVvDNT4'
var current

wss.on('connection', function connection(ws) {
    console.log('new Client')
    ws.on('message', function incoming(message) {
        var returnURL = ''

        console.log('received: %s', message);
        ws.send(message)
        request(`https://api.giphy.com/v1/gifs/search?api_key=jEcmFUpzZFnioiuyze2S4TerUnVvDNT4&q=${message}&limit=25&offset=0&rating=g&lang=en`, { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            else {
                if (body.data.length > 0) {
                    for(var i = 0; i < body.data.length - 1;i++) {
                        console.log(body.data[i].images.downsized.url);
                        returnURL = body.data[i].images.downsized.url

                        ws.send(returnURL)
                    }
                }
            }
        });
    });
});

server.listen(3003, () => console.log('Port :3003'))