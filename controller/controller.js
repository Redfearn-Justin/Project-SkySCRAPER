//Dependencies
var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
///========================================

//Model Requirements
var db = require("./models");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
///========================================

//Connecting to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true} );
///========================================

//Initializing Express
var app = express();



//Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://www.echojs.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("article h2").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      });
  
      // If we were able to successfully scrape and save an Article, send a message to the client
      res.send("Scrape Complete");
    });
  });
  
  // Route for getting all Articles from the db
  app.get("/articles", function(req, res) {
    
    db.Article.find({})
    .then(function(dbArticle) {
  
      res.json(dbArticle);
  
    })
    .catch(function(err){
  
      console.log(err.message);
  
      res.json(err);
    });
    // TODO: Finish the route so it grabs all of the articles
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
    let idIndex = req.params.id;
  
    db.Article.findOne({
      _id: idIndex
    })
    .populate("note").then(function(dbArticle) {
  
      res.json(dbArticle);
  
    }).catch(function(err) {
  
      console.log(err.message);
  
      res.json(err);
  
    });
  
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
  
    let updateId = req.params.id;
  
    let updateBody = req.body;
  
    db.Note.create(updateBody).then(function(dbNote) {
  
      return db.Article.findOneAndUpdate({ _id: updateId },{ note: dbNote._id },{ new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      console.log(err.message);
      res.send(err);
    });
  
  });