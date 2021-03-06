const request = require('request');
const express = require('express');
const app = express();
const server = require('http').createServer(app)
const WebSocket = require('ws');

const wss = new WebSocket.Server({ server:server });

const API_KEY = 'jEcmFUpzZFnioiuyze2S4TerUnVvDNT4'
var current

let listOfgifs

wss.on('connection', function connection(ws) {
    console.log('new Client')
    ws.on('message', function incoming(message) {
        var returnURL = ''

        console.log('received: %s', message);
        request(`https://api.giphy.com/v1/gifs/search?api_key=jEcmFUpzZFnioiuyze2S4TerUnVvDNT4&q=${message}&limit=25&offset=0&rating=g&lang=en`, { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            else {
                if (body.data.length > 0 && message != 'next40s') {
                    wss.clients.forEach(function each(client) {
                        returnURL = body.data[0].images.downsized.url
        
                        client.send(returnURL)
                        // if (client.readyState === WebSocket.OPEN) {
                        //     for(var i = 0; i < body.data.length ;i++) {
                        //         console.log(body.data[i].images.downsized.url);
                        //         returnURL = body.data[i].images.downsized.url
        
                        //         client.send(returnURL)
                        //     }
                        // }
                    });
                }
            }
        });
    });
});

app.get('/', function (req, res) {
    res.send('hello world')
})

server.listen(process.env.PORT, () => console.log(`Port :${process.env.PORT}`))