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

  $scope.filtros = {
    cdProduto: '',
    produto: new Produto(),
    tipo: '',
    tipoData: '0',
    dataInicial: null,
    dataFinal: null,
    buscarProduto: function(codigo) {
      if (!codigo || codigo == $scope.filtros.produto.codigo) {
        modalBuscarProduto.show().then(function(result) {
          $scope.filtros.produto = new Produto(result);
          $scope.filtros.cdProduto = $scope.filtros.produto.codigo;
        });
      } else {
        $scope.filtros.buscarProdutoPorCodigo(codigo);
      }
    },
    buscarProdutoPorCodigo: function(codigo) {
      $rootScope.loading.load();
      providerProduto.obterProdutoPorCodigo(codigo).then(function(success) {
        $scope.filtros.produto = new Produto(Produto.converterEmEntrada(success.data));
        $scope.filtros.cdProduto = $scope.filtros.produto.codigo;
        $rootScope.loading.unload();
      }, function(error) {
        console.log(error);
        $rootScope.loading.unload();
      });
    },
    limparTudo: function() {
      $scope.filtros.cdProduto = '';
      $scope.filtros.produto = new Produto();
      $scope.filtros.tipo = '';
      $scope.filtros.tipoData = '0';
      $scope.filtros.dataInicial = null;
      $scope.filtros.dataFinal = null;
    }
  };

  this.novaMovimentacao = new Movimentacao();
  this.movimentacoes = [ ];

  $scope.$on('$viewContentLoaded', function () {
    obterMovimentacoes();
  });

  $scope.atualizar = obterMovimentacoes;

  function obterMovimentacoes() {
    var filtros = {
      produtoId: $scope.filtros.produto.id,
      tipo: $scope.filtros.tipo,
      dataInicial: $scope.filtros.tipoData == 0 ? $scope.filtros.dataInicial : null,
      dataFinal: $scope.filtros.tipoData == 0 ? $scope.filtros.dataFinal : null,
      dataReferenciaInicial: $scope.filtros.tipoData == 1 ? $scope.filtros.dataInicial : null,
      dataReferenciaFinal: $scope.filtros.tipoData == 1 ? $scope.filtros.dataFinal : null
    };

    $rootScope.loading.load();
    provider.obterTodos(($scope.pagination.current - 1) * $scope.pagination.max + ',' + $scope.pagination.max, filtros).then(function(success) {
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
      .modal({
        backdrop: false,
        keyboard: false
      }).modal('show');
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
      provider.salvar(Movimentacao.converterEmSaida(this.novaMovimentacao)).then(function(success) {
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

// "user_id" => ( @$_POST["user_id"] ? $_POST["user_id"] : NULL ),
// "product_id" => ( @$_POST["product_id"] ? $_POST["product_id"] : NULL ),
// "document_id" => ( @$_POST["document_id"] ? $_POST["document_id"] : NULL ),
// "product_movement_date_reference_start" => @$_POST["product_movement_date_reference_start"] ? $_POST["product_movement_date_reference_start"] : NULL,
// "product_movement_date_reference_end" => @$_POST["product_movement_date_reference_end"] ? $_POST["product_movement_date_reference_end"] : NULL,
// "product_movement_date_start" => @$_POST["product_movement_date_start"] ? $_POST["product_movement_date_start"] : NULL,
// "product_movement_date_end" => @$_POST["product_movement_date_end"] ? $_POST["product_movement_date_end"] : NULL,
// "product_movement_order" => ( @$_POST["product_movement_order"] ? $_POST["product_movement_order"] : NULL ),
// "product_movement_limit" => ( @$_POST["product_movement_limit"] ? $_POST["product_movement_limit"] : NULL ),
// "get_user" => @$_POST["get_user"] ? 1 : NULL,
// "get_product" => @$_POST["get_product"] ? 1 : NULL
