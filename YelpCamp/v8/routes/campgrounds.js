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


//NEW - Shows form to create new campground

router.get("/new", (req,res) => {
    res.render("campgrounds/new");
});

//CREATE - Adds a new campground to the DB

router.post("/", (req,res) => {
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

module.exports = router;
