# <span style="color: #61dafb;">WebSocket</span>

## Problem and what is polling?
- let's say a cricket match is going and you are watching score on crickbuzz, for now score is 121 and to get the latest score you have to refresh the page or the fontend have to auto refresh the page after every 5 seconds.
- because till now we have learned that backend will only send response when frontend send request.
- same in chat application, if you want to get the latest message you have to refresh the page or the frontend have to auto refresh the page after every 5 seconds.
- even if there is no new message or score, we are calling backend again and again to get the latest data, this is bad.
- Here we are calling backend again and again to get the latest data, this is called `polling` and it is not efficient.
- polling is a technique where the frontend continuously sends requests to the backend to get the latest data, even if there is no new data available. This can lead to unnecessary network traffic and can be inefficient.

## 3 way handshake
- before sending message client and server have to establish a connection, this is called `handshake`.
- in TCP connection, there is a 3 way handshake process to establish a connection between client and server.
1. client sends a SYN (synchronize) packet to the server to initiate a connection.
2. server responds with a SYN-ACK (synchronize-acknowledge) packet to acknowledge the client's request and to synchronize the connection.
3. client sends an ACK (acknowledge) packet to the server to acknowledge the server's response and to establish the connection.
- after this handshake process, client and server can communicate with each other.

### Why need this and http1.0 ?
- because before sending the message which might be big, we check if server is available or not
- also we send message in packets and all of them has a sequence number, so what is the start of this sequence number, we can get it from the handshake process.
- client select random number as sequence number let's say 110 and send SYN packet to server, server will respond with SYN-ACK packet ACK=111 and SYN is server's sequence number let's say 200, this client will respond with ACK=201, now both client and server know the sequence number and they can communicate with each other.
- now server and client store a information about each other like IP address, port number, next sequence number, etc. this is called `connection state` and it is stored in the memory of both client and server.
- this connection state is used to keep track of the connection and to ensure that the messages are delivered in order and without any loss.
- Now they start communicating with each other.
- after sending request and getting getting response, they perform a 4 way handshake to terminate the connection.
1. client sends a FIN (finish) packet to the server to initiate the termination of the connection.
2. server responds with an ACK (acknowledge) packet to acknowledge the client's request to terminate the connection.
3. server sends a FIN (finish) packet to the client to initiate the termination of the connection from the server side.
4. client responds with an ACK (acknowledge) packet to acknowledge the server's request to terminate the connection and to complete the termination process. 
- after this 4 way handshake process, the connection is terminated and both client and server can free up the resources used for the connection.

### http1.1
- In http1.0 after sending request and getting response, connection is terminated, so for every request we have to establish a new connection which is not efficient.
- In http1.1, connection is not terminated after sending request and getting response, it is kept alive for some time, so we can send multiple requests and get responses without establishing a new connection every time, this is called `keep-alive` connection.
- but still client has to send request to get response.
- when this connection break? they break when either client or server send a FIN packet to terminate the connection.
- if non of them send FIN packet, then connection will be terminated after some time, this is called `timeout` and it is different for different browsers and servers, but it is usually around 2 minutes.

## Long polling
- in long polling, client sends a request to the server and server holds the request until there is new data available, then server sends response to the client and client immediately sends another request to the server, this way client can get the latest data without refreshing the page or auto refreshing the page.
- if server has no data till the timout occurs connection will be terminated automatically and client immediately sends another request to the server.
- But here server has to hold the request for a long time, this can lead to resource exhaustion on the server side if there are many clients connected to the server.

## http streaming or server side chunking
- in http streaming, server sends response to the client in chunks, so client can get the latest data.
- for example if it has to send `hello how are you?`  so when it gets the first chunk `hello` it sends it to the client, then it gets the second chunk `how are you?` and sends it to the client, this way client can get the latest data without refreshing the page or auto refreshing the page.
- problem in this (Head-of-Line Blocking) 
- if packet loss occures, then a pause will occur in the client side until the lost packet is retransmitted and received by the client, this can lead to a bad user experience.
- here client sees pause event if a single packet is lost.

## Web Socket
- It has to first make the TCP connection using 3 way handshake.
- Then it has to upgrade the connection from http to websocket using a 2 way handshake.
1. client sends a http request to the server with an `Upgrade` header to upgrade the connection to websocket.
2. server responds with a http response with an `Upgrade` header to acknowledge the client's request and to upgrade the connection to websocket.
- after this handshake process, client and server can communicate with each other using websocket protocol.
- they use socket programming.
- Now they can send messages to each other without the need of sending request and getting response, this is called `full duplex communication`.
- also they can send messages in both directions at the same time, this is called `bidirectional communication`.
- also they can send messages in real time, this is called `real-time communication`.
- websocket is stateful protocol, it means that client and server can store information about each other and use it to keep track of the connection and to ensure that the messages are delivered in order and without any loss.
- also websocket has a feature called `ping-pong` which is used to keep the connection alive, client can send a ping message to the server and server responds with a pong message, this way they can keep the connection alive and detect if the connection is lost.
- when does connection break? connection can break when either client or server send a close frame to terminate the connection, or when there is a network failure, or when there is a timeout.
- we can also store this connection state in database like redis, ans send a connection id to the client, so when client  reconnects to the server, it can send the connection id and server can retrieve the connection state from the database and continue the communication without any interruption.
- with this even if new connection request goes to other server it can retrieve the connection state from the database and continue the communication without any interruption, this is called `sticky session` or `session affinity`.

## There is also SSE (Server-sent event).
- in SSE, server can send message to the client without the need of sending request and getting response, this is called `unidirectional communication`.
- but client cannot send message to the server, this is called `half duplex communication`.
- In this client and server first make connection using 3 way handshake, then server sends response to the client with a `Content-Type` header set to `text/event-stream` to indicate that it is sending event stream data, then server can send messages to the client in the format of `data: message\n\n`, this way client can get the latest data without refreshing the page or auto refreshing the page.
- This is same as http streaming but batter version of it.
- for example it sends `hello how are you?` in one chunk, then when it get the new message `I am fine` it sends it to the client, this way client can get the latest data without refreshing the page or auto refreshing the page.
- but still it has the problem of Head-of-Line Blocking, if packet loss occurs, then a pause will occur in the client side until the lost packet is retransmitted and received by the client, this can lead to a bad user experience.
- This is useful for applications like news feed, stock price updates, cricbuzz score updates. etc.
- We have to do more reshearch in this this is just the basics.

## <span style="color: #61dafb;">socket.io</span>
- it is a library built on top of websocket, it provides a lot of features like automatic reconnection, multiplexing, etc.
- Whateven code that we can write using websocket we can write it using socket.io easily.
- The socket.IO connection can be established with different low-level transports.
1. HTTP long-polling
2. WebSocket
3. WebTransport

- it start with long-polling and then upgrade to websocket or webtransport if it is supported by the browser and firewall, this way it can work in all environments.

### Features
- Some of the browser or firewall may not support websocket, so socket.io will automatically fall back to long-polling or other transports, this way it can work in all environments.
- Let's say connection is established using websocket, but they are not talking to each other for some time, so in websocket we had to write extra code to check if the connection is alive or not, but in socket.io it has a buit-in feature called `ping-pong` which is used to keep the connection alive or to check if the connection is alive or not. this is done automatically by socket.io, so we don't have to write extra code for it.
- In websocket if client disconnect and then reconnects, then let's say we have sent some packets in that time, so for those packets we do not get the acknowledgement so socket.io will automatically resend those packets when client reconnects, to enable a specific feature called "Connection State Recovery." * When enabled, Socket.io stores messages in a temporary buffer (on the server).
- When the client reconnects (within a short window), they "sync" and the server pushes the missed packets.
- Logic Test: Without this specific configuration, Socket.io is just a "fire and forget" system.
- still the memory is limited, so if there are too many clients connected to the server, then it can lead to resource exhaustion on the server side, so we have to be careful while using this feature.

### HTTP/2.0 
- HTTP/2.0 works like HTTP/1.1 but it has some improvements like multiplexing, header compression, etc.
- multiplexing allows multiple requests and responses to be sent in parallel over a single connection, this way it can improve the performance of the application.
- header compression allows to compress the headers of the request and response, this way it can reduce the size of the request and response, this can also improve the performance of the application.

### HTTP/3.0
- It used UDP instead of TCP, this way it can reduce the latency of the application.
- It sends packet in UDP and in the receiving side it maintains a buffer that using sliding window protocal, the packets that are in order are sent to the application, and the packets that are out of order are stored in the buffer until they are received in order, this way it can ensure that the messages are delivered in order and without any loss.

### WebTransport
- It is upgraded version of websocket, it is built on top of HTTP/3.0, it uses UDP instead of TCP, this way it can reduce the latency of the application.
- It has all the features of websocket and it also has some additional features like multiplexing, header compression, etc.
- It is still in development and it is not supported by all browsers, but it is expected to be supported by all browsers in the future.


## Let's get to the implementation
- we have to install socket.io and we can pass our server to the socket.io, this way it can use the same server for both http and websocket.
    ```javascript
    const express = require('express');
    const app = express();
    const { Server } = require("socket.io");

    const server = app.listen(4000, ()=>{
        console.log("listning on port 4000");
    })

    const io = new Server(server);
    ```
- here we pass the server to the socket.io, this way it can use the same server for both http and websocket.
- We can use app for http routes and io for websocket routes.
- But we dont write it like that because we are listning first and then we are passing the server to the socket.io.
- we can use the original http server and then we can pass it to the socket.io, this way we can write our code in a better way.
    ```javascript
    const express = require('express');
    const app = express();
    const { Server } = require("socket.io");
    const http = require('http');

    const server = http.createServer(app);

    const io = new Server(server);

    server.listen(4000, ()=>{
        console.log("listning on port 4000");
    })
    ```

- this way we can first attach the socket.io to the http server and then we can start the server, this way we can write our code in a better way.
- How does io listn to the connection event?
    ```javascript
    io.on("connection", (socket) => {
        
        socket.on('message', (data)=>{
            io.emit('new-message', data);
        })

        socket.on("disconnect", ()=>{
            console.log("disconnected from server");
        })
    });
    ```
- here we are listening to the connection event, when a client send connection request to the server, then this event will be triggered and we can get the socket object in the callback function, this socket is used to communicate with the client it contains the information about the client like id, etc.
- and to disconnect from the server we use socket.on("disconnect", callback).
- here we can say that io means all the connected client and socket means a specific client.
- so socket.on('message', callback) means that we are listening to the message event from a specific client and io.emit('new-message', data) means that we are sending the new-message event to all the connected clients with the data. broadcasting the message to all the clients.