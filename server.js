var express = require("express");
var app = express();

app.use(express.static(__dirname + "/static"));
app.set("views",__dirname + "/views");
app.set("view engine", "ejs");

app.get("/", function(req, res){
	res.render("index");
})

var server = app.listen(1337, function(){
	console.log("listening on 1337");
});

var io = require("socket.io").listen(server);

var users = [];
var chats = [];

io.sockets.on("connection", function(socket){
	console.log("socketssssss");
	console.log("socket id: " + socket.id);

	//user joining
	socket.on("user_joining", function(data){
		// console.log(data);
		users[socket.id] = data.name;
		socket.emit("display_chats", {msgs: chats});
		io.emit("user_joined", {name: data.name});
	});

	//receiving msg
	socket.on("sending_msg", function(data){
		// console.log(data);
		chats.push({name: users[socket.id], msg: data.msg});
		console.log(chats);

		io.emit("msg_received", chats[chats.length-1]);
	});

	socket.on("disconnect", function(){
		io.emit("user_disconnected", {name: users[socket.id]});
		delete users[socket.id];
		console.log(users);
	})
});

