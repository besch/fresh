'use strict';

angular.module('Webresume')

.controller('LogoutCtrl', ['$scope', '$rootScope', '$state', '$timeout', 'auth', 
  function($scope, $rootScope, $state, $timeout, auth) {

  $rootScope.auth = null;
	auth.signout();
	$state.go('home');

}]);