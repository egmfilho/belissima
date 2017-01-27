/**
 * Created by egmfilho on 27/01/17.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('DescontosCtrl', DescontosCtrl);

DescontosCtrl.$inject = ['$rootScope', '$scope', 'ProviderTabelaDesconto', 'TabelaDesconto'];

function DescontosCtrl($rootScope, $scope, provider, TabelaDesconto) {

  var self = this;

  $scope.pagination = {
    current: 1,
    max: 15,
    total: 0,
    pageChanged: getDescontos
  };

  this.descontos = [];
  this.novo = new TabelaDesconto();

  function getDescontos() {
    self.descontos = [];
    $rootScope.loading.load();
    provider.obterTodos(($scope.pagination.current - 1) * $scope.pagination.max + ',' + $scope.pagination.max).then(function(success) {
      $scope.pagination.total = success.info.discount_table_quantity;
      angular.forEach(success.data, function(item, index) {
        self.descontos.push(new TabelaDesconto(TabelaDesconto.converterEmEntrada(item)));
      });
      console.log(self.descontos);
      $rootScope.loading.unload();
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  }

  getDescontos();

  this.atualizar = getDescontos;

  function salvar(desconto) {
    $rootScope.loading.load();
    provider.salvar(TabelaDesconto.converterEmSaida(desconto)).then(function(success) {
      $rootScope.loading.unload();
      $rootScope.alerta('Item salvo!', 'alert-success');
      getDescontos();
      jQuery('#modalTabelaDesconto').modal('hide');
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
      $rootScope.alerta.show(error.data.status.description, 'alert-danger');
    });
  }

  function editar(desconto) {
    $rootScope.loading.load();
    provider.editar(TabelaDesconto.converterEmSaida(desconto)).then(function(success) {
      $rootScope.loading.unload();
      $rootScope.alerta.show('Item editado!', 'alert-success');
      getDescontos();
      jQuery('#modalTabelaDesconto').modal('hide');
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
      $rootScope.alerta.show(error.data.status.description, 'alert-danger');
    });
  }

  this.salvar = function(desconto) {
    if (desconto.id) {
      editar(desconto);
    } else {
      salvar(desconto);
    }
  };

  this.excluir = function(desconto) {
    $rootScope.loading.load();
    provider.excluir(desconto.id).then(function(success) {
      $rootScope.loading.unload();
      $rootScope.alerta.show('Item excluído!', 'alert-success');
      getDescontos();
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
      $rootScope.alerta.show(error.data.status.description, 'alert-danger');
    });
  };

  this.abrirModal = function(desconto) {
    jQuery('#modalTabelaDesconto').on('show.bs.modal', function(e) {
      self.novo = desconto ? new TabelaDesconto(desconto) : new TabelaDesconto();
    }).modal('show');
  };
}
