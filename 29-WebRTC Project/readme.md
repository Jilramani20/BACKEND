## All possiblie connection scenarios
- same network (no firewall) - Connect with private IP address and port number
- different network (no firewall) - Connect with public IP address and port number using STUN server
- Any network (with firewall) - Connect with public IP address and port number using TURN server
- There is also a condition where we need TURN server even if there is no firewall and both are on different networks.
- Let's client uses STUN server to get ip and port and then share it using signaling but they cannot get message in that ip because that port is still used to talk with STUN server. In this case, we need to use TURN server to relay the message.
## 
- This all are called ICE (Interactive Connectivity Establishment) candidates. (Private IP PORT, Public IP PORT, TURN server IP PORT)
- WebRTC will try all the conditions on there own and will choose the best one to connect. This process is called ICE negotiation.
- We have to share all the candidates to the other peer because webRTC will decide which one is the best one to connect.
- We need to forward the ICE candidates to the other peer. we can use socket both of them should be connceted to a socket server.
- What detauls we need to send to the other peer?
    - candidate: the ip and port number (private or public or TURN server)
    - algorithm used to compress the data, data formate etc (offer) (How are we sending the data?)