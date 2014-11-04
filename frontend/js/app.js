'use strict';

angular.module('Webresume', [
  'ui.bootstrap', 
  'ui.bootstrap.tpls', 
  'ui.calendar',
  'firebase',
  'ui.router',
  'auth0'
])

.config(['$httpProvider', '$provide', 'authProvider', function ($httpProvider, $provide, authProvider) {
  $provide.factory('TokenInterceptor', function() {
    return {
      request: function (config) {
        console.log(config);
        return config;
      },

      response: function (config) {
        console.log(config);
        return config;
      },

      requestError: function (config) {
        return config;
      },

      responseError: function (config) {
        // console.log(config);
        return config;
      }
    };
  });

  authProvider.init({
    domain: 'webresume1.auth0.com',
    clientID: 'lvFvwLuOZGtc0yqd3BqOWzy7jybC1BdF',
    callbackURL: 'http://localhost:3000/',
    loginState: 'login'
  });

  $httpProvider.interceptors.push('authInterceptor');
  $httpProvider.interceptors.push('TokenInterceptor');
}])

.run(['$rootScope', '$state', '$timeout', '$firebaseSimpleLogin', 'FBURL', 'auth', 
  function ($rootScope, $state, $timeout, $firebaseSimpleLogin, FBURL, auth) {


  // var ref = new Firebase(FBURL);
  // var auth = $firebaseSimpleLogin(ref);
  // // console.log(auth);
  // $rootScope.auth = auth;

  $rootScope.$on('$stateChangeStart', function (e, next, nextParams, current) {
    // console.log(next.data);
    // console.log($rootScope.auth);
    // console.log(next.data);
    if ($rootScope.auth && $rootScope.auth.isAuthenticated && next.data && next.data.requiresLogin) {
      $timeout(function() {
        $state.go(next.name);
      });
    } 
    else if(!next.data) {
      $timeout(function() {
        $state.go(next.name);
      });
    }
    else {
      $timeout(function() {
        $state.go('login');
      });
    }
  });
  
  // $rootScope.$watch('auth', function (nextVal, currentVal) {
  //   if ((!nextVal.user || !currentVal.user) && $state.current.data.requiresLogin) {
  //     $timeout(function() {
  //       $state.go('login');
  //     });
  //   }
  // }, true);

  auth.hookEvents();

}]);
