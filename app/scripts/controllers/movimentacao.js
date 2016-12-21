/**
 * Created by egmfilho on 19/12/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('MovimentacaoCtrl', MovimentacaoCtrl);

MovimentacaoCtrl.$inject = [
  '$rootScope',
  '$scope',
  '$filter',
  'ProviderMovimentacao',
  'Movimentacao',
  'ModalBuscarProduto',
  'ProviderProduto',
  'Produto'
];

function MovimentacaoCtrl($rootScope, $scope, $filter, provider, Movimentacao, modalBuscarProduto, providerProduto, Produto) {

  var self = this;

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
    pageChanged: obterMovimentacoes
  };

  this.novaMovimentacao = new Movimentacao();
  this.movimentacoes = [ ];

  $scope.$on('$viewContentLoaded', function () {
    obterMovimentacoes();
  });

  function obterMovimentacoes() {
    $rootScope.loading.load();
    provider.obterTodos(($scope.pagination.current - 1) * $scope.pagination.max + ',' + $scope.pagination.max).then(function(success) {
      $scope.pagination.total = success.info.product_movement_quantity;
      self.movimentacoes = [];
      angular.forEach(success.data, function(item, index) {
        self.movimentacoes.push(new Movimentacao(Movimentacao.converterEmEntrada(item)));
      });
      $rootScope.loading.unload();
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  }

  this.abrirModalInserir = function() {
    jQuery('#modalInserir')
      .on('show.bs.modal', function(e) {
        self.novaMovimentacao = new Movimentacao();
        $scope.cdProduto = '';
      })
      .modal('show');
  };

  this.buscarProduto = function() {
    modalBuscarProduto.show().then(function(result) {
      self.novaMovimentacao.setProduto(new Produto(result));
      $scope.cdProduto = self.novaMovimentacao.produto.codigo;
    });
  };

  this.buscarProdutoPorCodigo = function(codigo) {
    $rootScope.loading.load();
    providerProduto.obterProdutoPorCodigo(codigo).then(function(success) {
      self.novaMovimentacao.setProduto(new Produto(Produto.converterEmEntrada(success.data)));
      $scope.cdProduto = self.novaMovimentacao.produto.codigo;
      $rootScope.loading.unload();
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  };

  function validarMovimentacao() {
    if (!self.novaMovimentacao.produto.id) {
      $rootScope.alerta.show('Preencha corretamente os campos!', 'alert-danger');
      return false;
    }

    if (!self.novaMovimentacao.valor) {
      $rootScope.alerta.show('Preencha corretamente os campos!', 'alert-danger');
      return false;
    }

    if (!self.novaMovimentacao.dataReferencia) {
      $rootScope.alerta.show('Preencha corretamente os campos!', 'alert-danger');
      return false;
    }

    return true;
  }

  this.inserirMovimentacao = function() {
    if (validarMovimentacao()) {
      $rootScope.salvar(Movimentacao.converterEmSaida(this.novaMovimentacao)).then(function(success) {
        $rootScope.loading.unload();
        $rootScope.alerta.show('Movimentação inserida!', 'alert-success');
        self.novaMovimentacao = new Movimentacao();
        obterMovimentacoes();
        jQuery('#modalInserir').modal('hide');
      }, function (error) {
        console.log(error);
        $rootScope.loading.unload();
      });
    }
  };

}
