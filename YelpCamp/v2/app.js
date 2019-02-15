var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

    
//Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
 var Campground = mongoose.model("Campground", campgroundSchema);
 
// Campground.create({
//     name: "Granite Hill", 
//     image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_1280.jpg",
//     description: "Huge granite hill, no bathrooms, no water"
    
// }, (err, campground) => {
//   if(err){
//       console.log("Error");
//   }else{
//       console.log(" reated new campground:" )
//       console.log(campground);
//   }
// });

mongoose.connect("mongodb://localhost:27017/yelp_camp",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.listen(process.env.PORT, process.env.IP, () =>{
    console.log("Server has started");
});

app.get("/", (req,res) => {
   res.render("landing");
});

//INDEX - Show all campgrounds

app.get("/campgrounds", (req, res) =>{
    Campground.find({}, (err, allCampgrounds) => {
        if(err){
            console.log(err);
        }else{
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});


//CREATE - Adds a new campground to the DB

app.post("/campgrounds", (req,res) => {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    
    Campground.create(newCampground, (err, campground) => {
      if(err){
          console.log(err);
      }else{
          res.redirect("/campgrounds");
      }
    });
    
});

//NEW - Shows form to create new campground

app.get("/campgrounds/new", (req,res) => {
    res.render("new.ejs");
});

//SHOW - Shows more infor about one campground

app.get("/campgrounds/:id", (req,res) => {
    //Find campground with the right id
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            console.log(err);
        }else{
             res.render("show", {campground: foundCampground }); 
        }
    });
});
