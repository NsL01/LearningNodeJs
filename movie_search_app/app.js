const express = require("express"),
      app = express(),
      request = require("request");
      
app.set("view engine", "ejs");
    
app.get("/results", (req, res) => {
    var query = req.query.search;
    request(`http://www.omdbapi.com/?s=${query}&apikey=thewdb`, (err, response, body) => {
       if(!err && response.statusCode == 200){
           const data = JSON.parse(body)
           //res.send(results.Search[0]. Title);
           res.render("results", {data: data});
       } 
    });
});

app.get("/", (req,res) => {
   res.render("search") 
});

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server has started");
});
