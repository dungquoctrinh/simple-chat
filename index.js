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
  

io.sockets.on('connection', function(socket)
{
  //set user name and initial setup
  socket.on("setusername", function(name)
  {
    //TODO: if not name. Set it equal anonymous
    if(name == null)
    {
      name = "anonymous";
    }
    //set user name
    socket.set('username', name);

    socket.get('username', function(err, name)
    {
      io.sockets.emit('isonline', {name : name})
    })
  })

  //user send message
  socket.on('send', function(data){
    socket.get('username', function(err,name)
    {
      io.sockets.emit('message', {name: name, message: data.message});
    });
  });

  //when user close the tab
  socket.on('disconnect', function()
  {
    socket.get('username', function(err,name)
    {
      io.sockets.emit('isoffline', {name: name});
    })
  })
})






