'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SearchHist = new Schema({
  searchStr: String,
  timestamp: Date
});

module.exports = mongoose.model('SearchHist', SearchHist);
