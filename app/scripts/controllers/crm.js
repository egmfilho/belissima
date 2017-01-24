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
  'ModalEditarPessoa',
  'Pessoa',
  'ProviderDocumento',
  'Documento',
  'ProviderComissao',
  'Comissao',
  'ProviderProduto',
  'ModalBuscarProduto',
  'Produto'
];

function CRMCtrl($rootScope, $scope, $cookies, modalBuscarPessoa, providerPessoa, ModalEditarPessoa, Pessoa, providerDocumento, Documento, providerComissao, Comissao, providerProduto, modalBuscarProduto, Produto) {

  var self = this,
      usuario = JSON.parse(window.atob($cookies.get('currentUser'))),
      date = new Date(),
      firstDay = new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0),
      lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0, 12, 0, 0);

  this.pessoa = new Pessoa();
  this.historico = [];
  this.comissoes = [];

  this.opcao = 'dados';

  $scope.$on('$viewContentLoaded', function() {
    setTimeout(function() {
      jQuery('input[name="cdPessoa"]').focus().select();
    }, 200);
  });

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
    status: {
      aberto: true,
      liberado: true,
      fechado: false,
      cancelado: false
    },
    dataInicial: firstDay,
    dataFinal: lastDay,
    limparTudo: function() {
      $scope.filtros.status.aberto = true;
      $scope.filtros.status.liberado = true;
      $scope.filtros.status.fechado = false;
      $scope.filtros.status.cancelado = false;
      $scope.filtros.dataInicial = firstDay;
      $scope.filtros.dataFinal = lastDay;
    }
  };

  $scope.liberarFinanceiro = function() {
    return (usuario.pessoaId == self.pessoa.id && self.isFuncionario());
  };

  this.buscarPessoa = function(codigo) {
    if (!codigo || codigo == this.pessoa.codigo) {
      modalBuscarPessoa.show().then(function(result) {
        self.buscarPessoaPorCodigo(result.codigo);
      });
    } else {
      this.buscarPessoaPorCodigo(codigo);
    }
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
      self.opcao = 'dados';
    }, function (error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  };

  this.editarPessoa = function () {
    $rootScope.loading.load();
    providerPessoa.obterPessoaPorCodigo(self.pessoa.codigo, self.pessoa.categorias.length ? self.pessoa.categorias[0].id : null, true, null, true, true, true, true, null, true).then(function (success) {
      $rootScope.loading.unload();
      ModalEditarPessoa.show(new Pessoa(Pessoa.converterEmEntrada(success.data)), function (result) {
        self.buscarPessoaPorCodigo(self.pessoa.codigo);
      });
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
    self.comissoes = [ ];
    providerComissao.obterPorFuncionario(pessoaId, ($scope.pagination.current - 1) * $scope.pagination.max + ',' + $scope.pagination.max, $scope.filtros).then(function(success) {
      $scope.pagination.total = success.info.comission_quantity;
      $scope.valorTotal = success.info.comission_value_total;
      $scope.mediaValorTotal = success.info.comission_value_total_avg;
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
