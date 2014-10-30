
'use strict';

var OpenTok = require('opentok'),
    config = require('../config.js'),
    apiKey = config.opentok.apiKey,
    apiSecret = config.opentok.apiSecret,
    opentok = new OpenTok(apiKey, apiSecret),
    sessionId,
    token;


opentok.createSession({mediaMode:'routed'}, function (err, session) {
  if (err) throw err;
  sessionId = session.sessionId;
  token = opentok.generateToken(sessionId, { role: 'moderator' });

  // token = opentok.generateToken(sessionId, { 
  //   role: 'moderator',
  //   expireTime : (new Date().getTime() / 1000)+(7 * 24 * 60 * 60), // in one week,
  //   data: 'userName'
  // });
});


module.exports = function(app) {

  app.get('/broadcasting/create', function (req, res) {
    
    if(apiKey && sessionId && token) {
      // console.log(apiKey)
      // console.log(sessionId)
      // console.log(token)
      return res.json({
        apiKey: apiKey,
        sessionId: sessionId,
        token: token
      });
    }
    throw new Error('Some of values wasn\'t generated');
  });

  // PUBLISHER PUBLISHED OWN STREAM, GET THE STREAM AND SEND TO 'join' ROUTE, SO OTHERS COULD CONNECT TO PUBLISHER STREAM IF EXISTS
  app.post('/broadcasting/post-publisher-streamid', function (req, res) {
    app.set('publisherStream', req.body.params.publisherStream);
    res.send(200);
  });

  app.get('/broadcasting/join', function (req, res) {
    if(apiKey && sessionId && token && app.get('publisherStream')) {
      return res.json({
        apiKey: apiKey,
        sessionId: sessionId,
        token: token,
        publisherStream: app.get('publisherStream')
      });
    }
    res.json('There are no broadcasts available in this moment');
    // throw new Error('Some of values wasn\'t generated');
  });
};
