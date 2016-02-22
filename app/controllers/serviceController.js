"use strict";

var SearchHist = require("../models/searchHist.js");
var https = require("https");

require("dotenv").load();

function ServiceController (){

  this.addSearch = function(searchStr, done){

    // check to see if search is empty
    if (typeof searchStr != "string" || searchStr.length === 0) {
      return done(null);
    }

    // Add new search to Search History database
    var now = new Date();
    var newSearch = new SearchHist({
      "searchStr": searchStr,
      "timestamp": now
    });

    newSearch.save(function(error,newSearch){
      if (error) {
        return done(null);
      }
      return done(newSearch);
    });
  }

  this.imageSearch = function(searchStr, offset, done) {

    // Format Google Custom Seach API URL
    var apiURL = "https://www.googleapis.com/customsearch/v1?key="+process.env.GOOGLE_API_KEY+"&cx="+process.env.GOOGLE_CSE_ID+"&q="+searchStr+"&searchType=image";

    // Handle the offset
    if (offset) {
      var start = String(10 * (offset-1) + 1);
      apiURL = apiURL + "&start=" + start;
    }
    console.log(apiURL);

    // HTTP get to Google API
    https.get(apiURL, function(res){
      var body = "";

      res.on("data", function(chunk){
        body += chunk;
      });

      res.on("end", function(){
        var googleResponse = JSON.parse(body);
        done(googleResponse.items);
      });
    }).on("error", function(error){
      done(null);
    });
  }

  this.databaseSearch = function(num, done){

    // Check that num is an integer
    if (!Number.isInteger(num)) {
      return done(null);
    }

    // get last num entires in database, and return the docs
    var latest = SearchHist.find().sort({timestamp: -1}).limit(num);

    latest.exec(function(error, docs) {
        if (error || !docs) {
          //if there are no entries, return null
          return done(null);
        }
        //entries exists
        return done(docs);
    });
  }

}

module.exports = ServiceController;
