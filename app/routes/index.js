"use strict"

var ServiceHandler = require(process.cwd()+"/app/controllers/serviceHandler.server.js");

module.exports = function (app) {
  var serviceHandler = new ServiceHandler();

  app.route("/")
      // return the main page
      .get(function(req,res){
        res.sendFile(process.cwd()+'/public/index.html')
      });
  app.route("/api/imagesearch/:query")
      // send all queries to image search function
      .get(serviceHandler.newSearch);
  app.route("/api/latest/:query")
      // send all latest paths to latest function
      .get(serviceHandler.latestSearch)
};
