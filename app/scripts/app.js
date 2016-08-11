'use strict';

angular
  .module('belissimaApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.calendar',
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
        controller: 'ServicoProdutosCtrl',
        controllerAs: 'servicoProdutos'
      })
      .when('/agenda', {
        templateUrl: 'views/agenda.html',
        controller: 'AgendaCtrl',
        controllerAs: 'agenda'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(['$rootScope', '$location', '$cookies', '$uibModalStack', 'Usuario', 'ProviderCategoriaPessoa', function($rootScope, $location, $cookies, $uibModalStack, Usuario, providerCategoria) {

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      $uibModalStack.dismissAll();
      $rootScope.currentPath = $location.path();
      //$rootScope.usuario = new Usuario();

      // Carrega as categorias de pessoa (cliente, funcionario, fornecedor)
      providerCategoria.obterCategorias().then(function(success) {
        $rootScope.categoriaPessoa = { };
        angular.forEach(success.data.data, function(item, index) {
          $rootScope.categoriaPessoa[item.person_category_name_formatted.toString().toLowerCase()] = item.person_category_id;
        });
      }, function(error) {
        console.log(error);
      });

      // Bloqueia acesso de usuarios nao logados
      if ($cookies.getObject('currentUser') == null || $cookies.getObject('currentUser').token == null) {
        if (next.templateUrl != 'views/login.html') {
          $location.path('/login');
        }
      }
    });

  }]);
