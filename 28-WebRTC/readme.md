# <span style="color: #ff6347;">WebRTC</span>
-   WebRTC (Web Real-Time Communication) is a technology that enables Web applications and sites to capture and optionally stream audio and/or video media, as well as to exchange arbitrary data between browsers without requiring an intermediary.
- The set of standards that comprise WebRTC makes it possible to share data and perform teleconferencing peer-to-peer, without requiring that the user install plug-ins or any other third-party software.
- Used for Audio/Video calls, File sharing, Gaming, Remote desktop, etc.

## Old way
- Let's say rohan and sohan are in a video call. Rohan's browser will send the video data to a server, and then the server will send it to Sohan's browser and same for Sohan's browser. So, the video data is going through a server in between.
- This is called client-server communication.
- There are many problems with this approach:
    - It is expensive to maintain a server that can handle the video data.
    - It can cause latency issues, as the video data has to go through a server before reaching the other user.
    - It can also cause security issues, as the video data is being sent to a third-party server.

## WebRTC
- In webRTC we don't need a server Rohan will directly send the video data to Sohan's browser and same for Sohan's browser. So, the video data is going directly between the two browsers without going through a server in between.
- This is called peer-to-peer communication.
- How can we do that What is needed for Rohan and Sohan to communicate directly?
    - They need to know each other's IP address and port number.
    - They need to establish a connection between them.
- How can they know each other's IP address and port number?
    - We definatly need a server for that.
    - They are connected to a server with socket and they can exchange their IP address and port number through that server.\
    - this is called signaling.
    - after that they can communicate directly without going through the server.
- How will rohan know it's own IP address and port number?
    - Because Rohan will have it's private IP address.
    - To know it's public IP address and port number, Rohan can use a technique called STUN (Session Traversal Utilities for NAT).
    - STUN is a protocol that allows a device to discover its public IP address and port number when it is behind a NAT (Network Address Translation) router.
    - Rohan will send a request to a STUN server, and the STUN server will respond with Rohan's public IP address and port number.
- Can we just start video call after exchanging IP address and port number?
    - Audio and video are first extracted and then travel independently.
    -  Video size is very large because it is colletion of many images. so we cannot send video directly on internet.
    - We will compress the video and in opposite side we will have to decompress the video and they need to knwow codex (technique used for compression and decompression) so they can decompress the video and watch it.
    - So before starting the video call they transfer session description which contains the information about the codex and other parameters needed for the video call.
    - This is called SDP (Session Description Protocol).
- In group call 
    - every one has to send IP and port and SDP to every one else. this is called mesh network and it is not scalable because as the number of users increases, the number of connections increases exponentially.
    - In this we are sending video to all the other people in that group call and we get all the video from all the other people in that group call. so it is not scalable.
    - we would need super high speed internet.
    - To solve this problem we can use intermediate server.
    - This is contradiction to the peer-to-peer communication but it is more scalable.
    - for small group call we can use peer-to-peer communication but for large group call we can use intermediate server.
    - Now everyone will send their video to the intermediate server and the intermediate server will send the video to all the other people in that group call.
    - It can use techniques like SFU (Selective Forwarding Unit) or MCU (Multipoint Control Unit) to manage the video streams and reduce the bandwidth usage.
- MCU (Multipoint Control Unit) 
    - In MCU, the server will mix all the video streams into a single stream and send it to all the users. This is not efficient because it requires a lot of processing power on the server.
    - Here it create a single stream from each video stream and send it to all the users. This is more efficient because it reduces the bandwidth usage and processing power on the server.
    - In this cilent send only one stream and receive only one stream. so it is more scalable.
    - But server needs to have high processing power and high bandwidth to handle all the video streams. so it is expensive to maintain such a server because it have to handle all the video compress, decompress, decode, single stream, etc. so it is expensive to maintain such a server.
    - this can also produce latency issues because the video data has to go through the server before reaching the other user.
    - also video layout will be fixed by the server and user cannot change the layout according to their preference. so it is not flexible.
- SFU (Selective Forwarding Unit)
    - In SFU, the server will forward the video streams to all the users without mixing them or decoding them. This is more efficient because it reduces the processing power on the server.
    - But here cilent send single stream but receive multiple stream now there browser has to do all other work. so the client needs to have high processing power and high bandwidth to handle all the video streams.
    - This is more scalable for server because it reduces the bandwidth usage and processing power on the server.
    - everyone uses this google meet, zoom, etc. because it put less load on the server and it is more scalable.
    -  SFU has done something so that load on the client is also reduced. 
    - It will only forward the active speaker's video stream to all the users.
    - also if everyones video stream is active then it will only forward the video stream of whom are visible on the screen also reduce the quality sometimes. In zoom there are 100 people but only 25 people are visible on the screen so it will only forward the video stream of those 25 people and reduce the quality.
    - Monstly not eveyone's video will be active if it is that will be paid version of zoom.
- TURN (Traversal Using Relays around NAT)
   - Lets say there are two user rohan and sohan and they are behind same NAT router so they dont need public ip because they are in same network.
   - If they are in same network they can use the private ip address.
   - But in most cases there is a Firewall between them. so rohan cannot send request to sohan firewall will block the request.
   - In this case we will need another server.
   - Rohan will send connection request to the server and sohan will do the same and now rohan will tell the server to make connection with soham now server will make connection with sohan and forward the video data from rohan to sohan and same for sohan to rohan. so video data is going through the server in between.
   - This is called TURN (Traversal Using Relays around NAT).
   - Rohan and Soham will exchange their turn ip address and port number through the signaling server and now they will send their video data to the TURN server and the TURN server will forward the video data to the other user. so video data is going through the server in between.



- Now from zero
    - WebRTC will get everything Private ip, public ip, turn ip, port number this is called ICE candinate (Interactive Connectivity Establishment).
    - after they will share this with each other through signaling server and then they will start the video call.
    - Now they will dittermine which method is best public to public, private to private, turn to turn etc. and they will start the video call using that method.
    - they can also use combination like one has firewall and other doesn't.