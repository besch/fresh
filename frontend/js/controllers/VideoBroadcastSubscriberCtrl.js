'use strict';

angular.module('Webresume')

.controller('VideoBroadcastSubscriberCtrl', ['$scope', '$http', 'TB', function ($scope, $http, TB) {

  var session,
      publisher,
      publisherMe,
      subscribers = {},
      myDivId = 'videoBroadcastMe',
      publisherDivId = 'videoBroadcastPublisher',
      subscriberDivId = 'videoBroadcastSubscribers',
      defaultBackgroundImageURI = 'http://tokbox.com/img/styleguide/tb-colors-cream.png';

  var publisherOptions = {
    publishAudio: false,
    publishVideo: false,
    width: 640,
    height: 360
  };

  var subscriberOptions = {
    publishAudio: false,
    publishVideo: true,
    width: 264,
    height:198
  };

  var myOptions = {
    publishAudio: false,
    publishVideo: true,
    width: 130,
    height: 90
  };

  $scope.listAllSessions = function () {
    $http.get('/conference/list-all-sessions').then(function (res) {
      $scope.sessions = res.data;
    });
  };
  $scope.listAllSessions();



  function initSession (api, sessionId) {
    return TB.initSession(api, sessionId);
  };

  function initPublisher (targetDiv) {
    return TB.initPublisher(targetDiv, myOptions);
  };

  function connectToSession (session, token) {
    session.connect(token, function(err, info) {
      if(err) console.log(err);
      console.log(info);

      session.publish(publisher, function (err, result) {
        if(err) console.log(err);
        // console.log(result.stream.id);
      });
    });
  };


  $scope.callUserId = function () {

    var sessionId = this.session.sessionId;
    var token = this.session.token;
    var apiKey = this.session.apiKey;
    console.log(this.session)

    session = initSession(apiKey, sessionId);
    publisher = TB.initPublisher(myDivId, myOptions);
    connectToSession(session, token);

    session.on('sessionConnected', sessionConnectedHandler);
    session.on('sessionDisconnected', sessionDisconnectedHandler);
    session.on('connectionCreated', connectionCreatedHandler);
    session.on('connectionDestroyed', connectionDestroyedHandler);
    session.on('streamCreated', streamCreatedHandler);
    session.on('streamDestroyed', streamDestroyedHandler);
  };

  $scope.disconnect = function () {
    session.disconnect();
    console.log('session disconnected');
  };

  $scope.startPublishing = function () {

  };

  $scope.stopPublishing = function () {
    // session.unpublish(publisherMe);
    // publisherMe = null;
  };


  function sessionConnectedHandler(event) {
    console.log('session connected');
    // for (var i = 0; i < event.streams.length; i++) {
    //   addStream(event.streams[i]);
    // }
  }

  function sessionDisconnectedHandler(event) {
    // publisherMe = null;
  }

  function streamCreatedHandler(event) {
    console.log('stream created');
    // Subscribe to publisher stream
    for (var i = 0; i < event.streams.length; i++) {
      addStream(event.streams[i]);
    }
  }  

  function addStream(stream) {
    console.log(stream)
    // Check if this is the stream that I am publishing or publisher stream, and if so do not publish.
    if (stream.connection.connectionId == session.connection.connectionId) {
      return;
    }
    else {
      addSubscriberToSubscribersDiv(stream);
    }
  }

  function addSubscriberToSubscribersDiv (stream) {

    if(stream.name === 'Host') {
      subscribers[stream.streamId] = session.subscribe(stream, publisherDivId, publisherOptions);
    }
    else {
      var subscriberDiv = document.createElement('div'); // Create a div for the subscriber to replace
      subscriberDiv.setAttribute('id', stream.streamId); // Give the replacement div the id of the stream as its id.
      subscriberDiv.setAttribute('class', 'subscriberDiv');

      document.getElementById(subscriberDivId).appendChild(subscriberDiv);
      subscribers[stream.streamId] = session.subscribe(stream, subscriberDiv.id, subscriberOptions, function (error) {
        if(error) return console.log(error.message);

        setSubscriberBackgroundImg(subscribers[stream.streamId]);
      });
    }

    var controlls = document.createElement('span');
    controlls.setAttribute('class', 'connection-controls');
    controlls.setAttribute('ng-click', 'callMe()');
    controlls.innerHTML = 'Call me';
    subscriberDiv.insertBefore(controlls);
    // var subscriberDivControls = document.createElement('ul');
    // subscriberDivControls.setAttribute('class', 'subscriberDivControls');
    // var callButton = document.createElement('li');
    // callButton.setAttribute('class', 'glyphicon glyphicon-earphone');
    // subscriberDivControls.appendChild(callButton);
    // ///////////////////////////////////////////////////////
    // subscriberDiv.appendChild(subscriberDivControls);
    // ///////////////////////////////////////////////////////



    
    // console.log(subscribers);
  }

  function setSubscriberBackgroundImg (subscriber) {
    if(subscriber.hasVideo) {
      var imgData = subscriber.getImgData();
      subscriber.setStyle('backgroundImageURI', imgData);
    } else {
      subscriber.setStyle('backgroundImageURI', defaultBackgroundImageURI);
    }
  }

  function streamDestroyedHandler(event) {
    // This signals that a stream was destroyed. Any Subscribers will automatically be removed.
    // This default behaviour can be prevented using event.preventDefault()
  }

  function connectionDestroyedHandler(event) {
    // This signals that connections were destroyed
  }

  function connectionCreatedHandler(event) {
    // This signals new connections have been created.
  }

  function exceptionHandler(event) {
    alert('Exception: ' + event.code + '::' + event.message);
  }
}])


.filter('splitUrl', ['$sce', function($sce) {
  return function(input) {
    if(input !== null && input !== 'undefined') {
      return $sce.trustAsResourceUrl(input.split('?')[0]);
    }
    else {
      return;
    }
  };
}])

.filter('notExpired', function () {
  return function (archives) {
    var availableArchives = [];
    for(var archive in archives) {
      if(archives[archive].status === 'available') {
        availableArchives.push(archives[archive]);
      }
    }
    return availableArchives;
  };
});