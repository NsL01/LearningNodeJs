var express = require("express"),
    app = express(),
    bodyParser = require("body-parser");
    
var friends = ["Marc", "Miranda", "Justin", "Pierre", "Lily"];
    
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
   res.render("home"); 
});

app.get("/friends", function(req,res){
    res.render("friends", {friends: friends});
});

app.post("/addfriend", function(req,res){
    var newFriend = req.body.newfriend;
    friends.push(newFriend);
    res.redirect("/friends");
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Sever started"); 
});