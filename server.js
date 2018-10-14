//Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
///========================================

//Model Requirements
var db = require("./models");
var PORT = process.env.PORT || 3000;

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
///========================================

//Initialize Express
var app = express();
///========================================

//Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
///========================================

//Setting up Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
///========================================



//Connecting to MongoDB
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