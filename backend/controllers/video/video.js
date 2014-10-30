'use strict';

// /**
//  * Module dependencies.
//  */
// var mongoose = require('mongoose'),
//     VideoResume = mongoose.model('VideoResume'),
//     _ = require('lodash');


// /**
//  * Find archive by id
//  */

exports.archive = function(req, res, next, id) {
  VideoResume.load(id, function(err, archive) {
    if (err) return next(err);
    if (!archive) return next(new Error('Failed to load archive ' + id));
    req.archive = archive;
    next();
  });
};

/**
 * Create an archive
 */
exports.create = function(req, res) {
  var archive = new VideoResume(req.body);
  archive.user = req.user;

  archive.save(function(err) {
    if (err) {
      return res.jsonp(500, {
        error: 'Cannot save the archive'
      });
    }
    res.jsonp(archive);
  });
};

/**
 * Update an archive
 */
exports.update = function(req, res) {
  var archive = req.archive;

  archive = _.extend(archive, req.body);

  archive.save(function(err) {
    if (err) {
      return res.jsonp(500, {
        error: 'Cannot update the archive'
      });
    }
    res.jsonp(archive);
  });
};

/**
 * Delete an archive
 */
exports.destroy = function(req, res) {
  var archive = req.archive;

  archive.remove(function(err) {
    if (err) {
      return res.jsonp(500, {
        error: 'Cannot delete the archive'
      });
    }
    res.jsonp(archive);
  });
};

/**
 * Show an archive
 */
exports.show = function(req, res) {
  res.jsonp(req.archive);
};

/**
 * List of Articles
 */
exports.all = function(req, res) {
  VideoResume.find().sort('-created').populate('user', 'name username').exec(function(err, archive) {
    if (err) {
      return res.send(500, 'Cannot list the archive');
      });
    }
    res.jsonp(archive);
  });
};
