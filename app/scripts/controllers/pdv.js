/**
 * Created by egmfilho on 28/11/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('PDVCtrl', PDVCtrl);

PDVCtrl.$inject = [
  '$rootScope',
  '$scope',
  'ModalBuscarTicket',
  'ProviderTicket',
  'Pedido',
  'ModalBuscarProduto',
  'ProviderProduto',
  'Produto',
  'ItemPedido',
  'ModalConfirm'
];

function PDVCtrl($rootScope, $scope, modalBuscarTicket, providerTicket, Ticket, modalBuscarProduto, providerProduto, Produto, ItemPedido, modalConfirm) {

  var self = this;

  this.ticket = new Ticket();
  this.tempItem = new ItemPedido();

  this.edicao = false;

  $scope.$on('$viewContentLoaded', function () {

    jQuery('body').bind('keyup', function (event) {
      // TECLA F6
      if (event.keyCode === 117) {
        self.edicao = !self.edicao;
        $scope.$apply();
        event.preventDefault();
      }
      // TECLA F8
      if (event.keyCode === 119) {
        self.abrirModalCliente();
      }
      // TECLA F9
      if (event.keyCode === 120) {
        self.abrirModalPagamento();
      }
    });

  });

  $scope.$on("$destroy", function () {
    jQuery('body').unbind('keyup');
  });

  function focarCodigo() {
    jQuery('input[name="cdProduto"]').focus().select();
  }

  function focarQuantidade() {
    jQuery('input[name="quantidade"]').focus().select();
  }

  $scope.focarDescontoPercent = function() {
    jQuery('input[name="descontoPercent"]').focus().select();
  };

  $scope.focarDescontoDinheiro = function() {
    jQuery('input[name="descontoDinheiro"]').focus().select();
  };

  this.novo = function () {
    modalConfirm.show('Aviso', 'Todas as informações serão perdidas, deseja proseguir?').then(function(result) {
      self.cancelarEdicao();
      self.ticket = new Ticket();
    });
  };

  this.abrirTicket = function() {
    modalBuscarTicket.show().then(function(result) {
      if (result) {
        $rootScope.loading.load();
        providerTicket.obterPorCodigo(result.codigo).then(function(success) {
          self.ticket = new Ticket(Ticket.converterEmEntrada(success.data));
          $rootScope.loading.unload();
          console.log(self.ticket);
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }
    });
  };

  this.buscarProduto = function() {
    modalBuscarProduto.show().then(function(result) {
      if (result) {
        self.tempItem.setProduto(new Produto(result));
        self.cdProduto = self.tempItem.codigo;
      }
    });
  };

  this.buscarProdutoPorCodigo = function(codigo) {
    $rootScope.loading.load();
    providerProduto.obterProdutoPorCodigo(codigo).then(function(success) {
      self.tempItem.setProduto(new Produto(Produto.converterEmEntrada(success.data)));
      self.cdProduto = self.tempItem.produto.codigo;
      $rootScope.loading.unload();
      focarQuantidade();
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
      if (error.status == 404) {
        $rootScope.alerta.show('Produto não encontrado!');
      }
    });
  };

  this.selectItem = function(item) {
    this.tempItem = new ItemPedido(item);
    this.tempItem.edicao = this.ticket.items.indexOf(item);
    this.cdProduto = self.tempItem.produto.codigo;
    jQuery('input[name="cdProduto"]').attr('disabled', true);
    jQuery('button[name="btnProduto"]').prop('disabled', true);
    focarQuantidade();
  };

  this.cancelarEdicao = function() {
    jQuery('input[name="cdProduto"]').attr('disabled', false);
    jQuery('button[name="btnProduto"]').prop('disabled', false);
    jQuery('input[name="quantidade"]').attr('disabled', false);
    jQuery('input[name="descontoPercent"]').attr('disabled', false);
    jQuery('input[name="descontoDinheiro"]').attr('disabled', false);
    this.tempItem = new ItemPedido();
    this.cdProduto = null;
    focarCodigo();
  };

  this.addItem = function() {
    if (!this.tempItem.produto.id || this.tempItem.quantidade <= 0) {
      this.cancelarEdicao();
      return;
    }

    if (this.tempItem.hasOwnProperty('edicao')) {
      this.ticket.items[this.tempItem.edicao] = new ItemPedido(this.tempItem);
      jQuery('input[name="cdProduto"]').attr('disabled', false);
      jQuery('button[name="btnProduto"]').prop('disabled', false);
    } else {
      this.ticket.addItem(this.tempItem);
      jQuery(".nota").animate({ scrollTop: $('.nota').prop("scrollHeight")}, 1000);
    }

    this.tempItem = new ItemPedido();
    this.cdProduto = null;
    focarCodigo();
  };

  this.removerItem = function() {

  };

  this.abrirModalCliente = function() {
    jQuery('#modalCliente').modal('show');
  };

  this.abrirModalPagamento = function() {
    jQuery('#modalPagamento').modal('show');
  };
}
