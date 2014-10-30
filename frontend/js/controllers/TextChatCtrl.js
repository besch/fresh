'use strict';

angular.module('Webresume')

.controller('TextChatCtrl', ['$scope', '$firebase', 'FBURL', '$timeout', '$rootScope', 'auth',
  function($scope, $firebase, FBURL, $timeout, $rootScope, auth) {

  var ref = new Firebase(FBURL + '/chat/messages'),
      sync = $firebase(ref);
  // ref.on('value', function(snap) {
  //   console.log(snap);
  // });

  $scope.messages = sync.$asArray();
  $scope.user = $rootScope.auth.profile.given_name + ' ' + $rootScope.auth.profile.family_name;

  $scope.addMessage = function() {
    if($scope.newMessage) {
      sync.$push({
        user: $scope.user, 
        text: $scope.newMessage, 
        timestamp: Firebase.ServerValue.TIMESTAMP
      });
      $scope.newMessage = '';
    }
  };
}]);
