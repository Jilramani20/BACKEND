const express = require('express');
const app = express();
const { Server } = require("socket.io");
const http = require('http');
const port = 4000;

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket)=>{

    socket.on('message', (data)=>{ //* key:value => 'message':data
        io.emit('new-message', data); //* broadcast new-msg to connected device
    })

    socket.on("disconnect", ()=>{
        console.log("disconnected from server");
    })
});

server.listen(port, ()=> {
    console.log(`Listning on port ${port}`);
});