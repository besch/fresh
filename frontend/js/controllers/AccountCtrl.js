'use strict';

angular.module('Webresume')

.controller('AccountCtrl', ['$scope', '$rootScope', '$firebase', '$firebaseSimpleLogin', 'FBURL', '$state', '$timeout', 
  function($scope, $rootScope, $firebase, $firebaseSimpleLogin, FBURL, $state, $timeout) {

    var ref = new Firebase(FBURL);
    var sync = $firebase(ref);

    var auth = $firebaseSimpleLogin(ref);

    $scope.changePassword = function() {
	  	auth.$changePassword(auth.user.email, $scope.user.oldPassword, $scope.user.newPassword)
  		.then(function () {
	  		console.log('Password changed');
	  	});
	  };

	  $scope.sendPasswordResetEmail = function() {
	  	auth.$sendPasswordResetEmail($scope.user.resetEmail)
	  	.then(function () {
	  		console.log('Instructions of new password send to email');
		  });
	  };

	  $scope.removeUser = function() {
	  	auth.$removeUser($scope.user.removeUserEmail, $scope.user.removeUserPassword)
	  	.then(function () {
		  		console.log('User was removed');
		  });
	  };

  }
]);