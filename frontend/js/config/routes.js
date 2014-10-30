"use strict";

angular.module('Webresume')

.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/home');
  $stateProvider
    
    .state('home', {
      url: '/home',
      templateUrl: 'views/home.html'
      // controller: 'HomeCtrl'
    })

    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'AuthCtrl'
    })

    .state('logout', {
      url: '/logout',
      template: '<div></div>',
      controller: 'LogoutCtrl'
    })

    .state('account', {
      url: '/account',
      templateUrl: 'views/account.html',
      controller: 'AccountCtrl',
      data: {requiresLogin: true}
    })

    .state('chat', {
      url: '/chat',
      templateUrl: 'views/chat.html',
      controller: 'TextChatCtrl',
      data: {requiresLogin: true}
    })

    .state('fileshare', {
      url: '/fileshare',
      templateUrl: 'views/fileshare.html',
      controller: 'FileShareCtrl',
      data: {requiresLogin: true}
    })

    .state('calendar', {
      url: '/calendar',
      templateUrl: 'views/calendar.html',
      controller: 'CalendarCtrl',
      data: {requiresLogin: true}
    })

    .state('video', {
      url: '/video',
      templateUrl: 'views/video.html',
      controller: 'VideoCtrl',
      data: {requiresLogin: true}
    })

    .state('video-broadcast-create', {
      url: '/video-broadcast-create',
      templateUrl: 'views/videoBroadcastPublisher.html',
      controller: 'VideoBroadcastPublisherCtrl',
      // data: {requiresLogin: true}
    })

    .state('video-broadcast-join', {
      url: '/video-broadcast-join',
      templateUrl: 'views/videoBroadcastSubscriber.html',
      controller: 'VideoBroadcastSubscriberCtrl',
      // data: {requiresLogin: true}
    });

}]);