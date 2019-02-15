var express = require("express");
var app = express();

//ROUTES
 
// "/" => "Hi there"
app.get("/", function(req, res){
   res.send("Hi there!"); 
});
// "/bye" => "Goodbye!"
app.get("/bye", function(req,res){
   res.send("Good bye"); 
});

// "/dog" => "MEOW!"
app.get("/dog", function(req,res){
   res.send("Meow!"); 
});

// The : means that subreeditName could be anything
app.get("/r/:subredditName", function(req, res) {
   res.send("Welcome to the " + req.params.subredditName +" subreddit"); 
});

app.get("/r/:subredditName/comments/:id/:title", function(req, res) {
   res.send("Welcome to a comment page"); 
});

//Each invalid route is a star THIS SHOULD ALWAYS BE THE 
// LAST ROUTE
app.get("*", function(req,res){
  res.send("YOUR A STAR!");  
});

//Tell express to listen for requests (start server)
//process.env.PORT is Cloud9 port number
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server has started"); 
});