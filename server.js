// const express = require('express');

// const app = express();

// const { createClient } = require('redis');
// app.use(express.json());
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);
// const client = createClient();

// client.on('error', err => console.log('Redis Client Error', err));

// client.connect();

// app.post('/', async (req, res) => {
//     console.log(req.body);
//     const { key, value } = req.body
//     const responce = await client.set(key, value);
//     res.json(responce)

// })
// app.get('/', async (req, res) => {
//     const key = req.body.key
//     const result = await client.get(key)
//     res.json(result)
// })


// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

// io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//     });
// });

// const port = 8000
// server.listen(port, () => {
//     console.log("listening on port", port);
// });

// Require express and socket.io
// const express = require('express');
// const socketio = require('socket.io');

// // Create an express app
// const app = express();

// // Create an http server with the express app
// const server = require('http').createServer(app);

// // Create a socket.io instance with the http server
// const io = socketio(server);

// // Listen for connection events from clients
// io.on('connection', (socket) => {
//     // Log the socket id
//     console.log('A client connected: ' + socket.id);

//     // Emit a welcome event to the client
//     socket.emit('welcome', 'sugallle sabeer bro');

//     // Listen for message events from the client
//     socket.on('message', (msg) => {
//         // Log the message
//         console.log('Received: ' + msg);

//         // Broadcast the message to all other clients
//         socket.broadcast.emit('message', msg);
//     });
//     app.get('/charging-station/:identity/start-transaction', (req, res) => {
//         // Emit an event called 'request' with some data
//         const identity = req.params.identity
//         io.emit('start', { identity });``

//         // Send a response to the client

//         res.send('start initiated');
//     });
//     socket.on('start-res', (msg) => {
//         console.log(msg);
//     })
//     // Listen for disconnect events
//     socket.on('disconnect', () => {
//         // Log the socket id
//         console.log('A client disconnected: ' + socket.id);
//     });
// });

// // Start the server on port 3000
// server.listen(5000, () => {
//     console.log('Server listening on port 5000');
// });
// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const io = require('socket.io')(server)
// io.on('connection', (socket) => {
//     console.log("connected");
//     app.get('/charging-station/:identity/start-transaction', (req, res) => {
//         const identity = req.params.identity
//         io.emit('start', { identity }, () => {
//             socket.on('response', (msg) => {
//                 res.json(msg);
//             })
//         });

//     });

// })

// server.listen(5000, () => {
//     console.log('listening on *:5000');
// });
// Require express and socket.io
// Require express and socket.io
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
let id
io.on("connection", (socket) => {
    console.log("A new client connected: " + socket.id);

    // Join a room based on identity
    id = socket.handshake.query.id;
    socket.join(id);

    // Handle response event from the client
    socket.on("response", (data) => {
        console.log("Received response from client: " + data);
        // Emit the response to the same room
        io.to(id).emit("response", data);
    });

    // Handle disconnect event
    socket.on("disconnect", () => {
        console.log("A client disconnected: " + socket.id);
        // Leave the room
        socket.leave(id);
    });

    app.get("/charging-station/:identity/start-transaction", (req, res) => {
        const identity = req.params.identity;
        // Emit the start event to the same room
        io.to(id).emit("start", { identity });
        // Listen for the response event from the same room
        io.to(id).once("response", (msg) => {
            console.log(msg);
            // Send the response to the HTTP request
            // res.json(msg);
        });
    });
});

// Handle HTTP request for starting a transaction


server.listen(5000, () => {
    console.log("listening on *:5000");
});
