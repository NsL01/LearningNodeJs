var express          = require("express"),
    methodOverride   = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose");

mongoose.connect("mongodb://localhost:27017/restful_blog_app",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer())
app.set("view engine", "ejs");

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema)

// RESTFUL ROUTES

app.get("/", (req,res) => {
    res.redirect("/blogs");
});


//INDEX ROUTE
app.get("/blogs", (req,res) => {
    Blog.find({}, (err, blogs) => {
       if(err){
           console.log(err);
       } else{
           res.render("index", {blogs: blogs});
       }
    });
});

//NEW ROUTE

app.get("/blogs/new", (req,res)=>{
   res.render("new"); 
});

//CREATE ROUTE

app.post("/blogs", (req,res)=>{
    //Sanitize
    req.body.blog.body = req.sanitize(req.body.blog.body)
    //Create blog
    Blog.create(req.body.blog, (err,newBlog)=>{
        if(err){
            res.render("new");
        }else{
            //Redirect to index
            res.redirect("/blogs");
        }
    });
})

// SHOW ROUTE
app.get("/blogs/:id", (req,res)=>{
    Blog.findById(req.params.id, (err,foundBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundBlog});
        }
    })
});

//Edit Route

app.get("/blogs/:id/edit", (req,res)=>{
    Blog.findById(req.params.id, (err,foundBlog)=>{
       if(err){
           res.redirect("/blogs");
       } else{
           res.render("edit", {blog: foundBlog});
       }
    });
});

// Update route

app.put("/blogs/:id", (req,res)=>{
   //Sanitize
   req.body.blog.body = req.sanitize(req.body.blog.body)
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err,updatedBlog)=>{
      if(err){
          res.redirect("/blogs");
      } else{
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

//Destroy route

app.delete("/blogs/:id", (req,res)=>{
    Blog.findByIdAndRemove(req.params.id, (err)=>{
       if(err){
           res.redirect("/blogs");
       } else{
           res.redirect("/blogs");
       }
    });
});

app.listen(process.env.PORT, process.env.IP, () => {
   console.log("Server is running"); 
});