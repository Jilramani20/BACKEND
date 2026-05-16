const express = require('express');
const app = express();
const { Server } = require("socket.io");
const http = require('http');
const path = require('path');
const port = 4000;

const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'index.html'))
})

io.on('connection', (socket)=>{
     // socket.on('message', (data)=>{
    //     socket.broadcast.emit('new-message', data);
    // })

    socket.on('message', ({roomId, msg})=>{
        socket.to(roomId).emit('new-message', msg);
    })

    socket.on('join-room', (roomId)=>{
        socket.join(roomId);
    })

     socket.on("disconnect", ()=>{
        console.log("disconnected from server");
    })

});

server.listen(port, ()=> {
    console.log(`Listning on port ${port}`);
});