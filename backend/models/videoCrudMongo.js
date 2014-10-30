var mongoose = require('mongoose');
var MongoGrid = mongoose.mongo.Grid;
var ObjectID = mongoose.mongo.BSONPure.ObjectID;
var config = require('../config');
var mongodbURL = config.mongo.domain;
var mongodbOptions = config.mongo.options;;

mongoose.connect(mongodbURL, mongodbOptions, function (err, db) {
  console.log('Connection successful to: ' + mongodbURL);
});

// VIDEO MODEL 
var VideoResume = new mongoose.Schema({
  user:    { type: String, require: true },
  title:        { type: String, require: true },
  description:  { type: String, require: true },
  created:      { type: Date,   default: Date.now },
  updated:      { type: Date,   default: Date.now },
  gridfsId:     { type: String, required: true },
  duration:     { type: Number, require: true},
  videoId:      { type: String, require: true},
  partnerId:    { type: String, require: true},
  sessionId:    { type: String, require: true},
  size:         { type: Number, require: true}
});

var videoModel = mongoose.model('VideoResume', VideoResume);
// VIDEO MODEL 


mongoose.connection.on('connected', function() {
  mongoGrid = new MongoGrid(mongoose.connection.db, 'fs');

  exports.createVResume = function (params) {
    mongoGrid.put(new Buffer(params.file), function(err, fileData) {
      if(err) console.log(err);
      
      var video = new videoModel();
      video.user        = params.user;
      video.title       = params.name;
      video.description = 'some description';
      video.gridfsId    = fileData._id;
      video.duration    = params.duration;
      video.videoId     = params.id;
      video.partnerId   = params.partnerId;
      video.sessionId   = params.sessionId;
      video.size        = params.size;

      video.save(function (err, result) {
        if(err) return console.log(err);
      });
    });
  };


  exports.deleteVResume = function (id) {
    videoModel.find(id, function (err, result) {
      if(err) return console.log(err);
      mongoGrid.delete(new ObjectID(result[0].gridfsId), function (gridErr, gridResult) {
        if(gridErr) console.log(gridErr);
      });
    }).remove(function (err, result) {
      if(err) console.log(err);
    });
  };

  
  exports.getVResume = function (id) {
    videoModel.find(id, function (err, result) {
      if(err) console.log(err);
      return result;
    });
  };


  exports.putVResume = function (id) {
    var updateVideo = {};
    updateVideo.title = 'video.title';
    updateVideo.description = 'video.description';
    updateVideo.file = new Buffer('video.file');
    updateVideo.updated = new Date();

    videoModel.update({ _id: id }, updateVideo, function (err, nbRows, raw) {
      if(err) console.log(err)
    });
  };

  exports.listVResume = function () {
    videoModel.find({}, function (err, result) {
      if(err) console.log(err);
    });
  };


});
