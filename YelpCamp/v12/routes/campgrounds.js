var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware"); //Automatically requires index.js
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

router.post("/", middleware.isLoggedIn, (req,res) => {
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    Campground.create(newCampground, (err, campground) => {
      if(err){
          console.log(err);
      }else{
          res.redirect("/campgrounds");
      }
    });
    
});


//NEW - Shows form to create new campground

router.get("/new", middleware.isLoggedIn, (req,res) => {
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

//EDIT - Edit a campground

router.get("/:id/edit", middleware.checkCampgroundOwnerSchip, (req,res)=>{
        Campground.findById(req.params.id, (err,foundCampground)=>{
            res.render("campgrounds/edit", {campground: foundCampground});
        });
});

//UPDATE - Update a campground

router.put("/:id", middleware.checkCampgroundOwnerSchip, (req, res) => {
    // Find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
       if(err){
           res.redirect("/campgrounds");
       } else{
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
    
    // Redirect 
});

//DESTROY - Removes a campground from the database

router.delete("/:id", middleware.checkCampgroundOwnerSchip, (req, res)=>{
       Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        if (err) {
            console.log(err);
        }
        Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect("/campgrounds");
        });
    });
});

module.exports = router;
