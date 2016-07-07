'use strict';

angular
  .module('belissimaApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/ticket', {
        templateUrl: 'views/ticket.html',
        controller: 'TicketCtrl',
        controllerAs: 'ticket'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(['$rootScope', '$location', '$cookieStore', function($rootScope, $location, $cookieStore) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      //if ($rootScope.globals == null || $rootScope.globals.currentUser == null) {
      if ($cookieStore.get('globals') == null || $cookieStore.get('globals').currentUser == null) {
        if (next.templateUrl != 'views/login.html') {
          $location.path('/login');
        }
      }
    });
  }]);
