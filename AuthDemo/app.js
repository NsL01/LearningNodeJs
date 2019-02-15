var express               = require("express"),
    app                   = express(),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    LocalStrategy         = require("passport-local"),
    User                  = require("./models/user"),
    passportLocalMongoose = require("passport-local-mongoose");
    
mongoose.connect("mongodb://localhost/auth_demo_app", { useNewUrlParser: true });

app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==========================
// ROUTES
// ==========================

app.get("/", (req,res) => {
    res.render("home");
});

app.get("/secret", isLoggedIn, (req,res) => {
   res.render("secret") 
});

// Auth Routes

//Show sign up form
app.get("/register", (req, res)=>{
   res.render("register"); 
});

//Handling user sign up
app.post("/register", (req, res)=>{
   User.register(new User({username: req.body.username}), req.body.password, (err,user)=>{
      if(err){
          console.log(err);
          return res.render('register');
      } else{
          passport.authenticate("local")(req, res, ()=>{
             res.redirect("/secret");
          });
      }
   });
});

// LOGIN Routes

//render login form
app.get("/login", (req, res) =>{
   res.render("login"); 
});

//Login logic
app.post("/login", passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/login"
}), (req, res)=>{
   
});

app.get("/logout", (req,res)=>{
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next();
    else res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, () => {
   console.log("Server started");
});