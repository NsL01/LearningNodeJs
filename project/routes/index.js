var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

//Route route
router.get("/", (req,res) => {
   res.render("landing");
});

// ===========================
// AUTH ROUTES
// =========================== 

//Show register form

router.get("/register", (req, res) => {
   res.render("register"); 
});

//Handle sign up logic

router.post("/register", (req, res) => {
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, (err, user)=>{
       if(err){
           req.flash("error", err.message);
           return res.render("register");
       }else{
           passport.authenticate("local")(req, res, ()=>{
               req.flash("succes", "Welcome to YelpCamp " + user.username);
               res.redirect("/newsfeed");
           });
       }
   }) ;
});

//Show login form

router.get("/login", (req,res)=>{
    res.render("login");
});

//Handle login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/newsfeed",
        failureRedirect: "/login"
    }), (req,res)=>{
    
});

//logout route
router.get("/logout", (req,res)=>{
    req.logout();
    req.flash("success", "Logged you out succesfully!");
    res.redirect("/");
});

router.get("/newsfeed", (req, res)=>{
   res.render("newsfeed"); 
});

module.exports = router;
