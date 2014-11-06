
'use strict';

var OpenTok = require('opentok'),
    Q = require('q'),
    config = require('../config'),
    sessionsCrudMongo = require('../models/sessionsCrudMongo'),
    apiKey = config.opentok.apiKey,
    apiSecret = config.opentok.apiSecret,
    opentok = new OpenTok(apiKey, apiSecret),
    sessions = {};


function createNewSession (email) {
  var deferred = Q.defer();
  opentok.createSession({mediaMode:'routed'}, function (err, session) {
    if (err) deferred.reject(new Error(err));
    var sessionId = session.sessionId;
    var token = opentok.generateToken(sessionId, { role: 'moderator', connection_data: email });

    sessionsCrudMongo.createSession(sessionId, email, token);

    deferred.resolve({
      sessionId: sessionId,
      token: token
    });
  });

  return deferred.promise;
}


module.exports = function(app) {

  app.get('/broadcasting/list-all-sessions', function (req, res) {
    // console.log(sessionsCrudMongo.listSessions())
    sessionsCrudMongo.listSessions().then(function (data) {
      res.json(data);
    });
  });

  app.post('/broadcasting/create', function (req, res) {
    // console.log(req.body.params);
    var email = req.body.params.email;
    var name = req.body.params.name;
    var description = req.body.params.description;

    var sessionData = createNewSession(email);
    sessionData.then(function (result) {
      if(apiKey && result.sessionId && result.token) {
        return res.json({
          apiKey: apiKey,
          sessionId: result.sessionId,
          token: result.token
        });
      }
      throw new Error('Some of values wasn\'t generated');
    });
  });

  // // PUBLISHER PUBLISHED OWN STREAM, GET THE STREAM ID AND SEND TO 'join' ROUTE, SO OTHERS COULD CONNECT TO PUBLISHER STREAM IF EXISTS
  // app.post('/broadcasting/post-publisher-streamid', function (req, res) {
  //   app.set('publisherStream', req.body.params.publisherStream);
  //   res.send(200);
  // });

  app.get('/broadcasting/join', function (req, res) {
    // if(apiKey && sessionId && token && app.get('publisherStream')) {
    //   return res.json({
    //     apiKey: apiKey,
    //     sessionId: sessionId,
    //     token: token,
    //     publisherStream: app.get('publisherStream')
    //   });
    // }
    res.json('There are no broadcasts available in this moment');
    // throw new Error('Some of values wasn\'t generated');
  });
};
