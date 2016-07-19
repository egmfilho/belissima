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
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('SessionInjector');
  }])
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
      .when('/logout', {
        template: '<h1>Logging out...</h1>',
        controller: 'LogoutCtrl'
      })
      .when('/ticket', {
        templateUrl: 'views/ticket.html',
        controller: 'TicketCtrl',
        controllerAs: 'ticket'
      })
      .when('/produtos', {
        templateUrl: 'views/servicosProdutos.html',
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(['$rootScope', '$location', '$cookies', function($rootScope, $location, $cookies) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      $rootScope.currentPath = $location.path();

      if ($cookies.getObject('currentUser') == null || $cookies.getObject('currentUser').token == null) {
        if (next.templateUrl != 'views/login.html') {
          $location.path('/login');
        }
      }
    });
  }]);
