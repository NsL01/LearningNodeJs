var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds"),
    Comment = require("./models/comment");

mongoose.connect("mongodb://localhost:27017/yelp_camp_v4",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

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
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});


//NEW - Shows form to create new campground

app.get("/campgrounds/new", (req,res) => {
    res.render("campgrounds/new");
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

//SHOW - Shows more infor about one campground

app.get("/campgrounds/:id", (req,res) => {
    //Find campground with the right id
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err){
            console.log(err);
        }else{
            
             res.render("campgrounds/show", {campground: foundCampground }); 
        }
    });
});

// ===========================
// COMMENTS ROUTES
// ===========================

app.get("/campgrounds/:id/comments/new", (req,res)=>{
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log("err");
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", (req,res)=>{
    Campground.findById(req.params.id, (err,campground)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, (err,comment)=>{
                if(err){
                    console.log(err);
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    })
}); 