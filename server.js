"use strict";

var express = require("express"),
    mongoose = require("mongoose"),
    routes = require("./app/routes/index.js");

var app = express();

require("dotenv").load();

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "mongodb://localhost/imageSearch";

mongoose.connect(mongoUri, function(err) {
    if(err) {
        console.log("connection error", err +" on "+mongoUri);
    } else {
        console.log("connection to "+mongoUri+" successful");
    }
});

app.use("/public", express.static(process.cwd() + "/public"));
app.use("/controllers", express.static(process.cwd() + "/app/controllers"));
app.use("/models", express.static(process.cwd() + "/app/models"));

routes(app);

var port = process.env.PORT || 5000;
app.listen(port,function(){
  console.log("Listening on port "+port+"...")
});
