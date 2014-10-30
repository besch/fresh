'use strict';

angular.module('Webresume')

.controller('AuthCtrl', ['$scope', '$rootScope', '$state', '$timeout', 'auth', 
  function($scope, $rootScope, $state, $timeout, auth) {

	auth.signin({
		popup: true
	}, function() {
		$rootScope.auth = auth;
		$state.go('home');
	}, function() {
		console.log('Failed to authenticate');
	});
}]);