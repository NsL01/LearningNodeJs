var express = require("express"),
    app = express(),
    bodyParser = require("body-parser");

    var campgrounds = [
        {name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_1280.jpg"},
        {name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_1280.jpg"},
        {name: "Mountaine Goat's Rest", image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_1280.jpg"}
    ];
    
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", (req,res) => {
   res.render("landing");
});

app.get("/campgrounds", (req, res) =>{
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", (req,res) => {
    var name = req.body.name;
    var image = req.body.name;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", (req,res) => {
    res.render("new.ejs")
})

app.listen(process.env.PORT, process.env.IP, () =>{
    console.log("Server has started");
});