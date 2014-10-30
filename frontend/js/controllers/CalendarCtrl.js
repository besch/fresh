'use strict';

angular.module('Webresume')

.controller('CalendarCtrl', ['$scope', '$firebase', 'FBURL', '$timeout', 'auth', 
  function($scope, $firebase, FBURL, $timeout, auth) {

  $scope.user = $rootScope.auth.profile.given_name + ' ' + $rootScope.auth.profile.family_name;
  $scope.equalsTracker = 0;

  var ref = new Firebase(FBURL + '/calendar'),
      sync = $firebase(ref);

  sync.$asArray();
  updateEvents();

  function updateEvents () {
    // console.log($scope.calEvents);
    $scope.eventSources = null;
    var temp, arr = [];
    $scope.calEvents = arr;
    $scope.eventSources = [$scope.calEvents];
    // console.log(arr);
    // console.log($scope.calEvents);
    ref.on('value', function (snap) {
      temp = snap.val();
      for(var ev in temp) {
        arr.push(temp[ev]);
      }
      // $timeout(function() {
        // $scope.$apply(function() {
      $scope.calEvents = arr;
      $scope.eventSources = [$scope.calEvents];
        // });
      // });
      // console.log($scope.calEvents);
      // arr = [];
    });
  }

  // function updateEvents () {
  //   var temp, arr = [];
  //   $scope.calEvents = arr;
  //   ref.on('value', function (snap) {
  //     temp = snap.val();
  //     for(var ev in temp) {
  //       arr.push(temp[ev]);
  //     }

  //     $scope.calEvents = arr;
  //     arr = [];
  //   });
  // }


  

  $scope.addEvent = function() {
    var start = $scope.eventStartDate.getTime(),
        end = $scope.eventStartDate.getTime(),
        now = Date.now();

    if(start < now) start = now;
    if(end < start) end = start + 15 * 60 * 1000; // 15 min
    // if($scope.eventUrl) $scope.eventUrl = '';
    
    if($scope.eventTitle) {
      sync.$push({
        start: start,
        end: end,    
        className: 'green',
        title: $scope.eventTitle,
        // url: $scope.eventUrl,
        allDay: true
      });

      updateEvents();
      $scope.eventTitle = '';
      $scope.eventUrl = '';
    }
  };


  // var ref = new Firebase(FBURL + '/calendar'),
  //     calEvents = $firebase(ref);

  // calEvents.$asArray();
  // updateEvents();

  // function updateEvents () {
  //   var temp, arr = [];
  //   $scope.calEvents = arr;
  //   ref.on('value', function (snap) {
  //     temp = snap.val();
  //     for(var ev in temp) {
  //       arr.push(temp[ev]);
  //     }

  //     $scope.calEvents = arr;
  //   });
  // }


  // $scope.eventSources = [$scope.calEvents];

  // $scope.addEvent = function() {
  //   calEvents.$push({
  //     start: $scope.eventStartDate.toUTCString(),
  //     end: $scope.eventEndDate.getDate(),    
  //     className: 'green',
  //     title: $scope.calEvent.title,
  //     url: $scope.calEvent.url,
  //     allDay: true
  //   });

  //   updateEvents();
  //   $scope.calEvent.title = '';
  //   $scope.calEvent.url = '';
  // };
 
  
  $scope.changeView = function(view){
    $scope.calendar.fullCalendar('changeView',view);
  };

  $scope.uiConfig = {
    fullCalendar:{
      height: 600,
      header:{
        left: 'month basicWeek basicDay agendaWeek agendaDay',
        center: 'title',
        right: 'today prev,next'
      },
      editable: true,
      dayClick: $scope.addEventOnClick,
      eventDrop: $scope.addOnDrop,
      eventResize: $scope.addOnResize
    }
  };





  // date pickers

  $scope.today = function() {
    $scope.eventStartDate = new Date();
    $scope.eventEndDate = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.openStartDate = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openedStart = true;
  };

  $scope.openEndDate = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openedEnd = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.initDate = new Date('2016-15-20');
  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
}])

.filter("eventFilter", function(){return function(events){
  return events;
}});



// 2014-08-12T21:14:02.763Z
// 2014-08-13T13:24:03.000Z

// Tue Aug 12 2014 23:14:02 GMT+0200 (CEST)
// Wed Aug 13 2014 15:24:03 GMT+0200 (CEST)