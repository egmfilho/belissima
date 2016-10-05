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
    'egmfilho.keys',
    'egmfilho.inputFilters',
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
          $rootScope.isLoading = true;
          return $rootScope.categoriaPessoa || provider.obterTodos().then(function(success) {
              $rootScope.categoriaPessoa = { };
              angular.forEach(success.data, function(item, index) {
                var categoria = new CategoriaPessoa(CategoriaPessoa.converterEmEntrada(item));
                $rootScope.categoriaPessoa[categoria.nomeFormatado] = categoria;
              });
              $rootScope.isLoading = false;
            }, function(error) {
              console.log(error);
              $rootScope.isLoading = false;
            });
        }]
      };
    }

    $routeProvider
      .when('/', {
        modulo: 'home',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      .when('/login', {
        modulo: 'login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/logout', {
        modulo: 'logout',
        template: '<h3>Logging out...</h3>',
        controller: 'LogoutCtrl'
      })
      .when('/ticket', {
        modulo: 'ticket',
        templateUrl: 'views/ticket.html',
        controller: 'TicketCtrl',
        controllerAs: 'ticket'
      })
      .when('/produtos', {
        modulo: 'product',
        templateUrl: 'views/servicosProdutos.html',
        controller: 'ServicoProdutosCtrl',
        controllerAs: 'servicoProdutos',
        resolve: resolveCategorias()
      })
      .when('/pessoas', {
        modulo: 'person',
        templateUrl: 'views/clientes.html',
        controller: 'ClientesCtrl',
        controllerAs: 'clientes',
        resolve: resolveCategorias()
      })
      .when('/agenda', {
        modulo: 'agenda',
        templateUrl: 'views/agenda.html',
        controller: 'AgendaCtrl',
        controllerAs: 'agenda',
        resolve: resolveCategorias()
      })
      .when('/configuracoes', {
        modulo: 'config',
        templateUrl: 'views/configuracoes.html',
        controller: 'ConfiguracoesCtrl',
        controllerAs: 'configuracoes'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(['$rootScope', function($rootScope) {
    $rootScope.versao = '0.7.1';
  }])
  .run(['$rootScope', '$location', '$cookies', '$uibModalStack', function($rootScope, $location, $cookies, $uibModalStack) {

    // para ser usado no ng-repeat
    $rootScope.getNumber = function(num) {
      return new Array(num <= 0 ? 0 : num);
    };

    $rootScope.isLoading = false;

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      $uibModalStack.dismissAll();
      $rootScope.currentPath = $location.path();

      // Bloqueia acesso de usuarios nao logados
      //if (!$cookies.get('BELISSIMA') || !$cookies.get('currentUser') || $cookies.get('BELISSIMA') != JSON.parse(window.atob($cookies.get('currentUser'))).sessao) {
      //  if (next.templateUrl !== 'views/login.html') {
      //    console.log('volta aqui!');
      //    $location.path('/login');
      //  }
      //  return;
      //}

      // Bloqueia acessos pelas permissoes
      //var user = JSON.parse(window.atob($cookies.get('currentUser')));
      //if (next.modulo && user.perfil.permissoes.hasOwnProperty(next.modulo)) {
      //  if (!user.perfil.permissoes[next.modulo].permissoes['access'].valor) {
      //    $location.path('/home');
      //  }
      //}
    });

  }]);
