'use strict';

angular.module('Webresume')

.controller('FileShareCtrl', ['$scope', '$firebase', 'FBURL', '$window', '$rootScope', 'auth', '$timeout', 
  function ($scope, $firebase, FBURL, $window, $rootScope, auth, $timeout) {
    
  $scope.file = null;
  $scope.isImage = false;

  console.log($rootScope.auth);
  $scope.user = $rootScope.auth.profile.given_name + ' ' + $rootScope.auth.profile.family_name

  // $timeout(function() {
  //   $scope.auth = auth;
  // }).then(function (data) {
  //   $scope.user = data.profile.given_name + ' ' + data.profile.family_name;
  //   console.log($scope.user);
  // });

  // if(auth) console.log(null);
  
  // $scope.$watch('auth', function (newVal, oldVal) {
  //   if(newVal && newVal.profile) {
  //     $scope.user = newVal.profile.given_name + ' ' + newVal.profile.family_name;
  //     console.log($scope.user);
  //   }
  // })
  // console.log($scope.auth.profile.nickname);

  // $scope.user = $scope.auth.profile.given_name + ' ' + $scope.auth.profile.family_name;
  // console.log($scope.user);

  var ref = new Firebase(FBURL + '/chat/files'),
      sync = $firebase(ref);

  $scope.files = sync.$asArray();
  // $scope.files = sync.$asArray(ref.limit(10));

  $scope.addFile = function() {
    if($scope.file) {
      sync.$push({
        user: $scope.user, 
        file: $scope.file,
        name: $scope.name,
        size: $scope.size,
        type: $scope.type,
        timestamp: Firebase.ServerValue.TIMESTAMP
      });
      $scope.file = null;
    }
  };

  $scope.removeFile = function(id) {
    var confirm = $window.confirm('Are you sure you want to delete this file?');
    if(confirm) sync.$remove(id);
    return;
  };
}])

.directive('fileread', function() {
  return {
    link: function(scope, el, attrs) {
      el.bind('change', function (changeEvent) {
        var reader = new FileReader();
        reader.onload = function(loadEvent) {
          scope.file = loadEvent.target.result;
          scope.name = changeEvent.target.files[0].name;
          scope.size = changeEvent.target.files[0].size;
          scope.type = changeEvent.target.files[0].type;
        };
        reader.readAsDataURL(changeEvent.target.files[0]);
      });
    }
  };
})

.filter('atob', function($window) {
  return function(input) {
    if(input.indexOf('image') > -1) return;

    var data = input.split(',')[1];
    // console.log(atob(data));   there are indentations but in html they disappear
    return $window.atob(data);
  };
})

.filter('fileSize', function() {
  return function(input) {
    return Math.round(input/1024);
  };
});

