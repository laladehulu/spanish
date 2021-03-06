var http = require('http');

// Send index.html to all requests
var app = http.createServer(function(req, res) {

    res.end("from spanish game server");
});

// Socket.io server listens to our app
var io = require('socket.io').listen(app);

// Send current time to all connected clients
function sendTime() {
    io.emit('time', { time: new Date().toJSON() });
}

// Send current time every 10 secs
setInterval(sendTime, 10000);

// Emit welcome message on connection
io.on('connection', function(socket) {
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.on('join', function(roomID,uid){//first time user must also notify other players here besides updating firebase, because all the player only loads firebase
        socket.join(roomID);
        socket.to(roomID).emit("new-player");
        console.log("player joined");
        socket.on('position',function(x,y){
            socket.to(roomID).emit("update-position",uid,x,y);
            console.log("player position update",uid,x,y);

        });
        socket.on("hand",function(x,y){
            socket.to(roomID).emit("update-hand",uid,x,y);
            console.log("player hand update",uid,x,y);
        })
        
        socket.on("inventory",function(inventoryJson){
            socket.to(roomID).emit("update-inventory",inventoryJson);
            //console.log("player hand update",uid,x,y);
        })
        socket.on("attack",function(){
            socket.to(roomID).emit("update-attack",uid);
        })
    });


});

app.listen(5000,function(){
    console.log("app is listening");
});
