'use strict';

angular.module('Webresume')

.controller('VideoBroadcastCtrl', ['$scope', '$http', 'TB', function ($scope, $http, TB) {

  var apiKey,
      sessionId,
      token,
      session,
      publisher,
      subscribers = {};

  var publisherOptions = {
    publishAudio: true,
    publishVideo: true,
    width: 640,
    height: 360
  };

  var subscriberOptions = {
    publishAudio: false,
    publishVideo: false,
    width: 264,
    height:198
  };

  $http.get('/broadcasting/create').then(function(res) {
    var apiKey = res.data.apiKey,
        sessionId = res.data.sessionId,
        token = res.data.token;

    session = TB.initSession(apiKey, sessionId);

    session.addEventListener('sessionConnected', sessionConnectedHandler);
    session.addEventListener('sessionDisconnected', sessionDisconnectedHandler);
    session.addEventListener('connectionCreated', connectionCreatedHandler);
    session.addEventListener('connectionDestroyed', connectionDestroyedHandler);
    session.addEventListener('streamCreated', streamCreatedHandler);
    session.addEventListener('streamDestroyed', streamDestroyedHandler);

    publisher = TB.initPublisher('videoBroadcastPublisher', publisherOptions);

    // session.connect(token, function(err, info) {
    //   if(err) console.log(err);
    //   session.publish(publisher);
    // });
  });


  $scope.connect = function () {
    session.connect(token, function(err, info) {
      if(err) console.log(err);
      console.log(info);
      session.publish(publisher);
    });
  };

  $scope.disconnect = function () {
    session.disconnect();
    console.log('session disconnected');
  };

  $scope.startPublishing = function () {
    if (!publisher) {
      publisher = session.publish(publisher);
      console.log(publisher);
    }
  };

  $scope.stopPublishing = function () {
    if (publisher) {
      session.unpublish(publisher);
    }
    publisher = null;
  };


  function sessionConnectedHandler(event) {
    // Subscribe to all streams currently in the Session
    for (var i = 0; i < event.streams.length; i++) {
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

  function streamDestroyedHandler(event) {
    // This signals that a stream was destroyed. Any Subscribers will automatically be removed.
    // This default behaviour can be prevented using event.preventDefault()
  }

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
  }

  // function addStream(stream) {
  //   if (stream.connection.connectionId == session.connection.connectionId) {
  //     return;
  //   }

  //   $scope.subscribers.push({
  //     id: stream.streamId,
  //     class: 'subscriberDiv',
  //     name: 'Some name'
  //   });

  //   var subscriberDiv = document.createElement('div'); // Create a div for the subscriber to replace
  //   subscriberDiv.setAttribute('id', stream.streamId); // Give the replacement div the id of the stream as its id.
  //   subscriberDiv.setAttribute('class', 'subscriberDiv');
  //   document.getElementById('videoBroadcastSubscribers').appendChild(subscriberDiv);
  //   subscribers[stream.streamId] = session.subscribe(stream, subscriberDiv.id, {width:264, height:198});
  // }

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