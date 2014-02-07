var express = require('express'),
      http = require('http'),
      app = express(),
      port = process.env.PORT || 5000; // Use the port that Heroku provides or default to 5000
      server = http.createServer(app)
      server.listen(port, function(){
        console.log("Starting server")
      });


app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(server);

var connectcounter = 0

io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});


io.sockets.on('connection', function(socket){
  socket.on("setusername", function(name){
    socket.set('username', name);
    socket.get('username', function(err, name){
      io.sockets.emit('isonline', {name : name})
    })
    })

  socket.on('send', function(data){
    socket.get('username', function(err,name){
      io.sockets.emit('message', {name: name, message: data.message});
    });
  });

  socket.on('disconnect', function(){
    socket.get('username', function(err,name){
      io.sockets.emit('isoffline', {name: name});
    })
  })
})






