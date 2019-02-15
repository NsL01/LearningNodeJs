var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground");
//INDEX - Show all campgrounds

router.get("/", (req, res) =>{
    Campground.find({}, (err, allCampgrounds) => {
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});


//CREATE - Adds a new campground to the DB

router.post("/", isLoggedIn, (req,res) => {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author: author};
    Campground.create(newCampground, (err, campground) => {
      if(err){
          console.log(err);
      }else{
          res.redirect("/campgrounds");
      }
    });
    
});


//NEW - Shows form to create new campground

router.get("/new", isLoggedIn, (req,res) => {
    res.render("campgrounds/new");
});


//SHOW - Shows more info about one campground

router.get("/:id", (req,res) => {
    //Find campground with the right id
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err){
            console.log(err);
        }else{
            
             res.render("campgrounds/show", {campground: foundCampground }); 
        }
    });
});

//Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}


module.exports = router;
