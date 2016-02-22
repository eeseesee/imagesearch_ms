"use strict";

var ServiceController = require(process.cwd() + "/app/controllers/serviceController.js");

function ServiceHandler () {

	this.newSearch = function (req, res) {

		var serviceController = new ServiceController();

		// Parse the search term and pagination value (i.e. offset)
		var searchStr = decodeURI(req.params.query);
		var offset = +req.query.offset;
		console.log(typeof offset);

		console.log("searching for page "+offset+" of "+searchStr);

		serviceController.addSearch(searchStr, function(added){
			if (!added){
				return res.json({"error": "Could not add to search history"})
			}
			serviceController.imageSearch(searchStr, offset, function(searchResult){
				if (!searchResult){
					return res.json({"error": "Error during image search"})
				}
				var resultArray = [];
				searchResult.forEach(function(result){
					var formatted = {
						url: result.link,
						snippet: result.snippet,
						page: result.image.contextLink
					}
					resultArray.push(formatted);
				});
				res.json(resultArray);
			});
		});
	}

	this.latestSearch = function (req, res) {

		var serviceController = new ServiceController();

		var num = +req.params.query;

		serviceController.databaseSearch(num, function(searchResult){
			if (!searchResult){
				return res.json({"error": "Invalid Database Search"})
			}
			var resultArray = [];
			searchResult.forEach(function(result){
				var formatted = {
					term: result.searchStr,
					when: result.timestamp
				}
				resultArray.push(formatted);
			});
			res.json(resultArray);
		});
	}

}

module.exports = ServiceHandler;
