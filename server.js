//Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
///========================================

//Model Requirements
var PORT = process.env.PORT || 3000;

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
///========================================

//Initialize Express
var app = express();
///========================================

//Parse request body as JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
///========================================

//Setting up Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
///========================================



//Connecting to MongoDB // latter isn't in instructions, consider taking out
mongoose.connect(MONGODB_URI, { useNewUrlParser: true} );
///========================================

//Importing - Enabling routes for server
var routes = require("./controller/controller.js");

app.use(routes);
///========================================


//Server listener
app.listen(PORT, function() {
    console.log(`App is currently running on ${PORT}!`);
});
///========================================