'use strict';

angular.module('belissimaApp.constants', [ ]);
angular.module('belissimaApp.services', [ ]);
angular.module('belissimaApp.directives', [ ]);
angular.module('belissimaApp.filters', [ ]);
angular.module('belissimaApp.controllers', [ ]);
angular
  .module('belissimaApp', [
    'belissimaApp.constants',
    'belissimaApp.services',
    'belissimaApp.controllers',
    'belissimaApp.directives',
    'belissimaApp.filters',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.calendar',
    'ui.bootstrap',
    'ui.mask',
    'multipleSelect'
  ])
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('SessionInjector');
  }])
  .config(function ($routeProvider) {
    function resolveCategorias() {
      return {
        '': ['$rootScope', 'ProviderCategoriaPessoa', 'CategoriaPessoa', function($rootScope, provider, CategoriaPessoa) {
          return $rootScope.categoriaPessoa || provider.obterTodos().then(function(success) {
              $rootScope.categoriaPessoa = { };
              angular.forEach(success.data, function(item, index) {
                var categoria = new CategoriaPessoa(CategoriaPessoa.converterEmEntrada(item));
                $rootScope.categoriaPessoa[categoria.nomeFormatado] = categoria;
              });
            });
        }]
      };
    }

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
        template: '<h3>Logging out...</h3>',
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
        controllerAs: 'servicoProdutos',
        resolve: resolveCategorias()
      })
      .when('/pessoas', {
        templateUrl: 'views/clientes.html',
        controller: 'ClientesCtrl',
        controllerAs: 'clientes',
        resolve: resolveCategorias()
      })
      .when('/agenda', {
        templateUrl: 'views/agenda.html',
        controller: 'AgendaCtrl',
        controllerAs: 'agenda',
        resolve: resolveCategorias()
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(['$rootScope', '$location', '$cookies', '$uibModalStack', 'Usuario', 'ProviderCategoriaPessoa', function($rootScope, $location, $cookies, $uibModalStack, Usuario, providerCategoria) {

    $rootScope.isLoading = false;

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      $uibModalStack.dismissAll();
      $rootScope.currentPath = $location.path();

      // Bloqueia acesso de usuarios nao logados
      if ($cookies.getObject('currentUser') == null || $cookies.getObject('currentUser').sessao == null) {
        if (next.templateUrl != 'views/login.html') {
          $location.path('/login');
        }
      }
    });

  }]);
