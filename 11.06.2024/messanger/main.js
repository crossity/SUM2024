import http from "node:http"
import fs from "node:fs"
import  { WebSocketServer } from "ws"

import express from "express"

let messages = [];

// loading last messages
fs.readFile("./log.txt", 'utf8', (err, data) => {
    if (err)
        console.log("ERROR: couldn't load logs");
    else {
        messages = JSON.parse(data);
        console.log(data);
    }
});

// Creating handler
const app = express();

let c = 0;
app.get('/', (req, res, next) => {
    c++;
    console.log(c);
    next();
});

app.use(express.static("client"));

// Http server creation
const server = http.createServer(app);

// Creating web socket
const wss = new WebSocketServer({ server });

function sendMessages(ws, messages) {
    ws.send(JSON.stringify(messages));
}

let clients = [];

wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        console.log(message.toString());
        messages.push(JSON.parse(message.toString()));
        for (let client of clients)
            sendMessages(client, messages);
        fs.writeFile("./log.txt", JSON.stringify(messages), err => {
            if (err)
                console.log(err);
        });
        // ws.send(`Hello, you send me ${message}`);
    });
    ws.on("close", (ws) => {
        clients.slice(clients.indexOf(ws), 1);
        console.log("hello");
    });

    // ws.send("New Client connected");
    clients.push(ws);
    sendMessages(ws, messages);
});

const host = 'localhost';
const port = 8000;

server.listen(port, host, () => {
    console.log(`server started on http://${host}:${port}`);
});