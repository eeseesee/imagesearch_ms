require("dotenv").load();

var SearchHist = require(process.cwd() + "/app/models/searchHist.js"),
  mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "mongodb://localhost/imageSearch",
  expect = require("chai").expect,
  mongoose = require("mongoose"),
  clearDB = require("mocha-mongoose")(mongoUri, {noClear: true});

var ServiceController = require(process.cwd() + "/app/controllers/serviceController.js");

describe("serviceController", function() {

    var serviceController;

    before(function(done) {
      var connection = mongoose.connect(mongoUri);
      serviceController = new ServiceController();
      mongoose.connection.on("connected", function() {
        console.log("test connection successful");
        done();
      });
    });

    before(function(done) {
      clearDB(done);
    })

    describe("#addSearch", function() {

        it("should return null when null search is added", function(done) {
            var searchStr = null;
            serviceController.addSearch(searchStr, function(added) {
                expect(added).to.equal(null);
                done();
            });
        })

        it("should not return null when valid Search is added", function(done) {
            var searchStr = "cats";
            serviceController.addSearch(searchStr, function(added) {
                expect(added.searchStr).to.be.a("string");
                done();
            });
        })

        it("should add search to the database", function(done) {
            var searchStr = "dogs";
            serviceController.addSearch(searchStr, function(added) {
                SearchHist.findOne({
                  searchStr: added.searchStr
                },
                'searchStr timestamp',
                function(error, doc){
                  if (error) {
                    return done(null);
                  }
                  expect(doc.searchStr).to.equal(searchStr);
                  done();
                });
            });
        })

      });

    describe("#imageSearch", function() {

        it("should return array with 10 objects", function(done) {
            var searchStr = "fish";
            var offset = undefined;

            serviceController.imageSearch(searchStr, offset, function(result) {
                expect(result).to.have.length(10);
                done();
            });
        })

    });

    describe("#databaseSearch", function() {

        it("should return null when invalid num is provided", function(done) {
            var num = "invalid entry";
            serviceController.databaseSearch(num, function(result) {
                expect(result).to.equal(null);
                done();
            });
        })

        it("should return array with num objects", function(done) {
            var num = 2;

            serviceController.databaseSearch(num, function(result) {
                expect(result).to.have.length(num);
                done();
            });
        })

        it("should return the latest search when num = 1", function(done) {
          var searchStr1 = "forks";
          var searchStr2 = "spoons"
          var num = 1;

          serviceController.addSearch(searchStr1, function() {
            serviceController.addSearch(searchStr2, function() {
              serviceController.databaseSearch(num, function(result) {
                console.log(result);
                  expect(result[0].searchStr).to.equal(searchStr2);
                  done();
              });
            });
          });
        })

    });

    after(function(done) {
        mongoose.modelSchemas = {};
        mongoose.models = {};
        mongoose.connection.close();
        mongoose.disconnect()
        mongoose.connection.on('disconnected', function() {
            console.log("done disconnecting");
            done();
        });
    });
});
