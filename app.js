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
        console.log("player joined");
        socket.on('position',function(x,y){
            socket.to(roomID).emit("update-position",uid,x,y);
            console.log("player position update",uid,x,y);

        });
        socket.on("hand",function(x,y){
            socket.to(roomID).emit("update-hand",uid,x,y);
            console.log("player hand update",uid,x,y);
        })
    });


});

<<<<<<< HEAD
app.listen(5000,function(){
=======
app.listen(80,function(){
>>>>>>> 1a4f30c5617f748b513fce85eed150e4232fb2b0
    console.log("app is listening");
});
