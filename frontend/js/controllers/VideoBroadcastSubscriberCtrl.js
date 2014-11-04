'use strict';

angular.module('Webresume')

.controller('VideoBroadcastSubscriberCtrl', ['$scope', '$http', 'TB', function ($scope, $http, TB) {

  var session,
      publisherMe,
      subscribers = {},
      publisherDivId = 'videoBroadcastPublisher',
      subscriberDivId = 'videoBroadcastSubscribers',
      defaultBackgroundImageURI = 'http://tokbox.com/img/styleguide/tb-colors-cream.png';

  $scope.listAllSessions = function () {
    $http.get('/broadcasting/list-all-sessions').then(function (res) {
      $scope.sessions = res.data;
    });
  };

  $scope.publisherStream = null;
  $scope.sessions = $scope.listAllSessions();

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

  var myOptions = {
    publishAudio: false,
    publishVideo: false,
    width: 130,
    height: 90
  };

  
  $http.get('/broadcasting/join').then(function (res) {
    $scope.apiKey = res.data.apiKey,
    $scope.sessionId = res.data.sessionId,
    $scope.token = res.data.token,
    $scope.publisherStream = res.data.publisherStream;

    session = TB.initSession($scope.apiKey, $scope.sessionId);
    publisherMe = TB.initPublisher('videoBroadcastMe', myOptions);

    session.on('sessionConnected', sessionConnectedHandler);
    session.on('sessionDisconnected', sessionDisconnectedHandler);
    session.on('connectionCreated', connectionCreatedHandler);
    session.on('connectionDestroyed', connectionDestroyedHandler);
    session.on('streamCreated', streamCreatedHandler);
    session.on('streamDestroyed', streamDestroyedHandler);
  });


  $scope.connect = function () {
    session.connect($scope.token, function(err, info) {
      if(err) console.log(err);
      console.log(info);
      session.publish(publisherMe);
    });
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
    // Check if this is the stream that I am publishing or publisher stream, and if so do not publish.
    if (stream.connection.connectionId == session.connection.connectionId) {
      return;
    }

    if(stream.streamId === $scope.publisherStream) {
      subscribers[stream.streamId] = session.subscribe(stream, publisherDivId, publisherOptions);
    }

    else {
      addSubscriberToSubscribersDiv(stream);
    }
  }

  function addSubscriberToSubscribersDiv (stream) {

    var subscriberDivControls = document.createElement('ul');
    subscriberDivControls.setAttribute('class', 'subscriberDivControls');
    var callButton = document.createElement('li');
    callButton.setAttribute('class', 'glyphicon glyphicon-earphone');
    subscriberDivControls.appendChild(callButton);



    var subscriberDiv = document.createElement('div'); // Create a div for the subscriber to replace
    subscriberDiv.setAttribute('id', stream.streamId); // Give the replacement div the id of the stream as its id.
    subscriberDiv.setAttribute('class', 'subscriberDiv');
    ///////////////////////////////////////////////////////
    subscriberDiv.appendChild(subscriberDivControls);
    ///////////////////////////////////////////////////////
    document.getElementById(subscriberDivId).appendChild(subscriberDiv);
    var subscriber = subscribers[stream.streamId] = session.subscribe(stream, subscriberDiv.id, subscriberOptions, function (error) {
      if(error) return console.log(error.message);

      setSubscriberBackgroundImg(subscriber);
    });
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