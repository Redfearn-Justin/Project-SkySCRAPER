//Dependencies
var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
///========================================

//Model Requirements
var PORT = process.env.PORT || 3000;
var db = require("./models");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoAssignment";
///========================================

//Initialize Express
var app = express();
///========================================

//Express functionalities
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
///========================================

//Connecting to MongoDB
mongoose.connect(MONGODB_URI);
///========================================


//Routes
//========================================

// A GET route for scraping website
app.get("/scrape", function (req, res) {

    axios.get("https://www.gamespot.com/news/").then(function (response) {

        var $ = cheerio.load(response.data);

        $("article.media.media-article").each(function (i, element) {

            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(element).find("h3").text();

            result.summary = $(element).find("p").text();

            result.link = $(element).find("a").attr("href");

            console.log(result);

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });

            // //then post the articles to the page
            // db.Article.find({})
            //     .then(function (dbArticle) {

            //         res.json(dbArticle);

            //     })
            //     .catch(function (err) {

            //         console.log(err.message);

            //         res.json(err);
            //     });
        });

        // If we were able to successfully scrape and save an Article, send a message to the client
        res.send("Scrape Complete & post complete");
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
  //TO DO NOT VALID
  // TODO: Finish the route so it grabs all of the articles
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    //TO DO NOT VALID
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
    let idIndex = req.params.id;

    db.Article.findOne({
        _id: idIndex
    })
        .populate("note").then(function (dbArticle) {

            res.json(dbArticle);

        }).catch(function (err) {

            console.log(err.message);

            res.json(err);

        });

});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    //TO DO NOT VALID
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note

    let updateId = req.params.id;

    let updateBody = req.body;

    db.Note.create(updateBody).then(function (dbNote) {

        return db.Article.findOneAndUpdate({ _id: updateId }, { note: dbNote._id }, { new: true });
    })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            console.log(err.message);
            res.send(err);
        });

});

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  