/**
 * Created by egmfilho on 20/12/16.
 */

angular.module('belissimaApp.controllers')
  .controller('CRMCtrl', CRMCtrl);

CRMCtrl.$inject = [
  '$rootScope',
  '$scope',
  '$cookies',
  'ModalBuscarPessoa',
  'ProviderPessoa',
  'Pessoa',
  'ProviderDocumento',
  'Documento',
  'ProviderComissao',
  'Comissao',
  'ProviderProduto',
  'ModalBuscarProduto',
  'Produto'
];

function CRMCtrl($rootScope, $scope, $cookies, modalBuscarPessoa, providerPessoa, Pessoa, providerDocumento, Documento, providerComissao, Comissao, providerProduto, modalBuscarProduto, Produto) {

  var self = this, usuario = JSON.parse(window.atob($cookies.get('currentUser')));

  this.pessoa = new Pessoa();
  this.historico = [];
  this.comissoes = [];

  $scope.format = 'dd/MM/yyyy';
  $scope.altInputFormats = ['d!/M!/yy'];
  $scope.dateOptions = {
    formatYear: 'yyyy',
    startingDay: 0,
    showWeeks: false
  };

  $scope.pagination = {
    current: 1,
    max: 15,
    total: 0,
    pageChanged: function() {
      obterComissoes(self.pessoa.id);
    }
  };

  $scope.filtros = {
    status: '',
    dataInicial: null,
    dataFinal: null,
    limparTudo: function() {
      $scope.filtros.status = '';
      $scope.filtros.dataInicial = null;
      $scope.filtros.dataFinal = null;
    }
  };

  $scope.liberarFinanceiro = function() {
    return (usuario.pessoaId == self.pessoa.id && self.isFuncionario());
  };

  this.buscarPessoa = function() {
    modalBuscarPessoa.show().then(function(result) {
      self.buscarPessoaPorCodigo(result.codigo);
    });
  };

  this.buscarPessoaPorCodigo = function(codigo) {
    $rootScope.loading.load();
    providerPessoa.obterPessoaPorCodigo(codigo, null, true, null, true, true, true, true, null, true).then(function(success) {
      self.pessoa = new Pessoa(Pessoa.converterEmEntrada(success.data));
      $scope.cdPessoa = self.pessoa.codigo;
      $rootScope.loading.unload();
      self.historico = [ ];
      self.comissoes = [ ];
      obterHistorico(self.pessoa.id);
      if ($scope.liberarFinanceiro()) {
        obterComissoes(self.pessoa.id);
      }
      console.log(self.pessoa);
    }, function (error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  };

  this.isFuncionario = function() {
    for (var i = 0; i < self.pessoa.categorias.length; i++) {
      if (self.pessoa.categorias[i].id == $rootScope.categoriaPessoa.funcionario.id) {
        return true;
      }
    }
    return false;
  };

  function obterHistorico(pessoaId) {
    $rootScope.loading.load();
    providerDocumento.obterPorCliente(pessoaId).then(function(success) {
      self.historico = [ ];
      angular.forEach(success.data, function(item, index) {
        self.historico.push(new Documento(Documento.converterEmEntrada(item)));
      });
      $rootScope.loading.unload();
      console.log(self.historico);
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  }

  function obterComissoes(pessoaId) {
    if (!self.isFuncionario()) return;

    $rootScope.loading.load();
    providerComissao.obterPorFuncionario(pessoaId, ($scope.pagination.current - 1) * $scope.pagination.max + ',' + $scope.pagination.max, $scope.filtros).then(function(success) {
      $scope.pagination.total = success.info.comission_quantity;
      self.comissoes = [ ];
      angular.forEach(success.data, function(item, index) {
        self.comissoes.push(new Comissao(Comissao.converterEmEntrada(item)));
      });
      console.log(self.comissoes);
      $rootScope.loading.unload();
    }, function(error) {
      self.comissoes = [ ];
      console.log(error);
      $rootScope.loading.unload();
    });
  }
}
