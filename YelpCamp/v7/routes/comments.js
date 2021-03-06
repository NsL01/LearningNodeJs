var express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment");

//Comments New
router.get("/new", isLoggedIn, (req,res)=>{
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log("err");
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
});

//Comments create
router.post("/", isLoggedIn, (req,res)=>{
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