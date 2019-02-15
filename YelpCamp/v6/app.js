var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    User = require("./models/user"),
    seedDB = require("./seeds"),
    Comment = require("./models/comment");

mongoose.connect("mongodb://localhost:27017/yelp_camp_v6",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

//Passport configuration
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
   res.locals.currentUser = req.user;
   next();
});

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
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
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

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req,res)=>{
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log("err");
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req,res)=>{
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

// ===========================
// AUTH ROUTES
// =========================== 


//Show register form

app.get("/register", (req, res) => {
   res.render("register"); 
});

//Handle sign up logic

app.post("/register", (req, res) => {
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, (err, user)=>{
       if(err){
           console.log(err);
           return res.render("register");
       }else{
           passport.authenticate("local")(req, res, ()=>{
               res.redirect("/campgrounds");
           });
       }
   }) ;
});

//Show login form

app.get("/login", (req,res)=>{
    res.render("login");
});

//Handle login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req,res)=>{
    
});

//logout route
app.get("/logout", (req,res)=>{
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}