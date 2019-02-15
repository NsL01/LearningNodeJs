var express = require("express"),
    app = express();

app.get("/", function(req,res){
   res.send("Hi there, welcome to my assignment!"); 
});

app.get("/speak/:animal", function(req, res){
    var sounds = {
        pig: "Oink",
        cow: "Moo",
        dog: "Woof Woof!",
        cat: "I hate humans",
        goldfish: "GlouGlou"
    };
    var animal = req.params.animal.toLowerCase();
    var sound = sounds[animal];
    res.send("The " + animal + " says \"" + sound + "\"");
});

app.get("/repeat/:words/:times", function(req, res){
    var word = req.params.words;
    var num = parseInt(req.params.times);
    var string = "";
    for(var i = 0; i<num; i++){
        string+= word + " ";
    }
    res.send(string);
});

app.get("*", function(req,res){
   res.send("Sorry, page not found... What are you doing with your life?"); 
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server has started"); 
});