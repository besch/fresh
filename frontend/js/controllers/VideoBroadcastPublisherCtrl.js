'use strict';

angular.module('Webresume')

.controller('VideoBroadcastPublisherCtrl', ['$scope', '$rootScope', '$http', 'TB', function ($scope, $rootScope, $http, TB) {

  var apiKey,
      sessionId,
      token,
      session,
      publisher,
      subscribers = {},
      publisherDivId = 'videoBroadcastPublisher',
      subscriberDivId = 'videoBroadcastSubscribers',
      defaultBackgroundImageURI = 'http://tokbox.com/img/styleguide/tb-colors-cream.png';

  $scope.subscribers = {};

  var publisherOptions = {
    publishAudio: false,
    publishVideo: true,
    width: 640,
    height: 360,
    name: 'Host',
    rememberDeviceAccess: true
    // style.nameDisplayMode: off
  };

  var subscriberOptions = {
    publishAudio: false,
    publishVideo: true,
    width: 264,
    height:198
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

  $scope.createBroadcasting = function () {
    $http.post('/conference/create', { params: {
      email: $rootScope.auth.profile.email,
      name: $scope.broadcasting.name,
      description: $scope.broadcasting.description
    }}).then(function(res) {
      apiKey = res.data.apiKey;
      sessionId = res.data.sessionId;
      token = res.data.token;

      session = TB.initSession(apiKey, sessionId);
      publisher = TB.initPublisher(publisherDivId, publisherOptions);
      connectToSession(session, token);

      session.on('sessionConnected', sessionConnectedHandler);
      session.on('sessionDisconnected', sessionDisconnectedHandler);
      session.on('connectionCreated', connectionCreatedHandler);
      session.on('connectionDestroyed', connectionDestroyedHandler);
      session.on('streamCreated', streamCreatedHandler);
      session.on('streamDestroyed', streamDestroyedHandler);
    });
  };

 

  // $scope.stopPublishing = function () {
  //   if (publisher) {
  //     session.unpublish(publisher);
  //   }
  //   publisher = null;
  // };


  function sessionConnectedHandler(event) {
    console.log('someone connected')
    // Subscribe to all streams currently in the Session
    for (var i = 0; i < event.streams.length; i++) {
      // console.log(event.streams[i]);
      addStream(event.streams[i]);
    }
  }

  function sessionDisconnectedHandler(event) {
    publisher = null;
  }

  function streamCreatedHandler(event) {
    // Subscribe to the newly created streams
    for (var i = 0; i < event.streams.length; i++) {
      TB.log('streamCreated - connectionId: ' + event.streams[i].connection.connectionId);
      TB.log('streamCreated - connectionData: ' + event.streams[i].connection.data);
      addStream(event.streams[i]);
    }
  }

  // function streamDestroyedHandler(event) {
  //   // This signals that a stream was destroyed. Any Subscribers will automatically be removed.
  //   // This default behaviour can be prevented using event.preventDefault()
  // }

  function addStream(stream) {
    // Check if this is the stream that I am publishing, and if so do not publish.
    if (stream.connection.connectionId == session.connection.connectionId) {
      return;
    }
    var subscriberDiv = document.createElement('div'); // Create a div for the subscriber to replace
    subscriberDiv.setAttribute('id', stream.streamId); // Give the replacement div the id of the stream as its id.
    subscriberDiv.setAttribute('class', 'subscriberDiv');
    document.getElementById('videoBroadcastSubscribers').appendChild(subscriberDiv);
    subscribers[stream.streamId] = session.subscribe(stream, subscriberDiv.id, subscriberOptions);

    // $scope.subscribers[stream.streamId] = {
    //   id: stream.streamId,
    //   class: 'subscriberDiv',
    //   name: 'Some name'
    // };
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








.factory('TB', ['$window', function($window) {
  return $window.TB;
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