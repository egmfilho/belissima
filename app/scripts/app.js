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
  .config(['$httpProvider', '$locationProvider', function($httpProvider, $locationProvider) {
    $httpProvider.interceptors.push('SessionInjector');
    $locationProvider.hashPrefix('');
  }])
  .config(function ($routeProvider) {

    /*
      .cliente, .funcionario, .fornecedor...
     */
    function getCategorias($rootScope, provider, CategoriaPessoa) {
      $rootScope.loading.load();
      return provider.obterTodos().then(function(success) {
        $rootScope.categoriaPessoa = { };
        angular.forEach(success.data, function(item, index) {
          var categoria = new CategoriaPessoa(CategoriaPessoa.converterEmEntrada(item));
          $rootScope.categoriaPessoa[categoria.nomeFormatado] = categoria;
        });
        $rootScope.loading.unload();
      }, function(error) {
        console.log(error);
        $rootScope.loading.unload();
      });
    }
    function resolveCategorias() {
      return {
        '': ['$rootScope', 'ProviderCategoriaPessoa', 'CategoriaPessoa', function($rootScope, provider, CategoriaPessoa) {
          return $rootScope.categoriaPessoa || getCategorias($rootScope, provider, CategoriaPessoa);
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
      .when('/pdv', {
        modulo: 'pdv',
        templateUrl: 'views/pdv.html',
        controller: 'PDVCtrl',
        controllerAs: 'pdv',
        resolve: resolveCategorias()
      })
      .when('/ticket/:action', {
        modulo: 'ticket',
        templateUrl: 'views/ticket.html',
        controller: 'TicketCtrl',
        controllerAs: 'ticket',
        resolve: resolveCategorias()
      })
      .when('/produtos', {
        modulo: 'product',
        templateUrl: 'views/servicosProdutos.html',
        controller: 'ServicoProdutosCtrl',
        controllerAs: 'servicoProdutos',
        resolve: resolveCategorias()
      })
      .when('/movimentacao', {
        modulo: 'movimentation',
        templateUrl: 'views/movimentacao.html',
        controller: 'MovimentacaoCtrl',
        controllerAs: 'movimentacao'
      })
      .when('/pessoas', {
        modulo: 'person',
        templateUrl: 'views/clientes.html',
        controller: 'ClientesCtrl',
        controllerAs: 'clientes',
        resolve: resolveCategorias()
      })
      .when('/crm', {
        modulo: 'crm',
        templateUrl: 'views/crm.html',
        controller: 'CRMCtrl',
        controllerAs: 'crm',
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
      .when('/ajuda', {
        modulo: 'ajuda',
        templateUrl: 'views/ajuda.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(['$rootScope', function($rootScope) {
    // ver 0.7.3
    //
    // - Loading corrigido na agenda
    // - Scroll no "+ eventos" da agenda
    // - Paginção melhorada
    // - Loading da agenda on demand
    // - Hora corrigida na exibicao quando nao exibia os minutos 00
    // - Opcoes de intervalos na visualizacao "dia" da agenda
    // - Corrigido diferença de segundos na hora dos eventos
    // - Visualizacao "dia" na agenda mostra a hora atual mais abaixo do topo
    // - Filtro de categoria na tabela de pessoas
    //
    // ver 0.7.4
    //
    // - Modal editar pessoa nao pede mais CPF obrigatorio
    // - Modal novo evento abre na data do calendario
    // - Eventos nao conflitam quando um termina na hora que o outro começa
    // - Preparado para bloqueio de datas na agenda
    // - Paginacao modal buscar pessoa
    // - Paginacao modal buscar endereco
    // - Paginacao modal buscar produto/servico
    // - Visualizacao de linha do tempo na agenda
    // - Dicas adicionadas nos botoes da agenda
    // - Dialogo de confirmacao de encerramento de agendamento para continuar agendando para o mesmo cliente
    //
    // ver 0.7.5
    //
    // - Adicionada opcao de apresentar janela de troco por forma de pagamento
    // - Corrigido bug onde o "checkAll" continuava marcado mesmo depois de fechar e abrir outro modal de prazo
    // - Post do PDV alterado de "ticket" pra "document"
    //
    // ver 0.8
    //
    // - Adicionado tela de CRM
    // - Adicionado tela de Movimentação de estoque
    // - Tela de Ticket controlada através da comanda
    // - Novo ícone para tela de Ticket
    // - Gerenciamento de comandas na tela de configurações do sistema
    // - Corrigido problema de regressao nas datas das parcelas
    // - Opcao de desvincular pessoa do usuario
    //
    // ver 0.8.1
    //
    // - Nova tela de ticket
    // - Adicionado código da comanda na tela lista de tickets
    // - Adicionada a versão mobile da agenda
    // - Edicao de pessoas na tela do CRM
    // - Corrigido problema dos objetos que ao darem append-to-body, apareciam na posicao errada
    $rootScope.versao = '0.8.1';
  }])
  .run(['$rootScope', '$location', '$cookies', '$timeout', '$uibModalStack', function($rootScope, $location, $cookies, $timeout, $uibModalStack) {

    // para ser usado no ng-repeat
    $rootScope.getNumber = function(num) {
      return new Array(Math.max(0, num));
    };

    $rootScope.loading = {
      count: 0,
      isLoading: function() { return this.count > 0 },
      load: function() { this.count++; },
      unload: function() { this.count--; this.count < 0 ? this.count = 0 : null; }
    };

    $rootScope.alerta = {
      mensagem: '',
      classe: 'alert-warning',
      elem: jQuery('.alerta'),
      hide: null,
      show: function (mensagem, classe) {
        if (mensagem) this.mensagem = mensagem;
        this.classe = classe || 'alert-warning';

        if (this.hide) {
          clearTimeout(this.hide);
          this.hide = null;
        }

        var self = this;
        this.elem.css('opacity', '0');
        this.elem.css('display', 'inline');
        this.elem.fadeTo('slow', 1, function () {
          self.hide = setTimeout(function () {
            self.elem.fadeTo('slow', 0, function () {
              self.elem.css('display', 'none');
            });
          }, 3000);
        });
      }
    };

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      $uibModalStack.dismissAll();
      $rootScope.currentPath = $location.path();

      // Bloqueia acesso de usuarios nao logados
      if (!$cookies.get('BELISSIMA') || !$cookies.get('currentUser') || $cookies.get('BELISSIMA') != JSON.parse(window.atob($cookies.get('currentUser'))).sessao) {
        if (next && next.templateUrl) {
          if (next.templateUrl !== 'views/login.html' && next.templateUrl.indexOf('impressaoOrcamento.html') < 0) {
            $location.path('/login');
          }
          return;
        }
      }

      // Bloqueia acessos pelas permissoes
      if ($cookies.get('currentUser')) {
        var user = JSON.parse(window.atob($cookies.get('currentUser')));
        if (next.modulo && user.perfil.permissoes.hasOwnProperty(next.modulo)) {
          if (!user.perfil.permissoes[next.modulo].permissoes['access'].valor) {
            $rootScope.alerta.show('Acesso não autorizado!', 'alert-danger');
            $location.path('/home');
          }
        }
      }

    });

  }]);
