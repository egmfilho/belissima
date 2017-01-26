/**
 * Created by egmfilho on 20/12/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('ComandasCtrl', ComandasCtrl);

ComandasCtrl.$inject = [ '$rootScope', '$scope', 'ProviderComanda', 'Comanda' ];

function ComandasCtrl($rootScope, $scope, provider, Comanda) {

  var self = this;

  setTimeout(function() {
    jQuery('input[name="cdComanda"]').focus().select();
  }, 200);

  $scope.pagination = {
    current: 1,
    max: 20,
    total: 0,
    pageChanged: obterComandas
  };

  this.novaComanda = new Comanda();
  this.arrayComandas = [];

  function obterComandas() {
    $rootScope.loading.load();
    provider.obterTodos(($scope.pagination.current - 1) * $scope.pagination.max + ',' + $scope.pagination.max).then(function(success) {
      $scope.pagination.total = success.info.card_quantity;
      self.arrayComandas = [];
      angular.forEach(success.data, function(item, index) {
        self.arrayComandas.push(new Comanda(Comanda.converterEmEntrada(item)));
      });
      $rootScope.loading.unload();
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  }
  obterComandas();

  this.addComanda = function() {
    if (!this.novaComanda.codigoDeBarras) {
      return;
    }

    $rootScope.loading.load();
    provider.salvar(Comanda.converterEmSaida(this.novaComanda)).then(function(success) {
      self.novaComanda = new Comanda();
      $rootScope.loading.unload();
      $rootScope.alerta.show('Comanda adicionada!', 'alert-success');
      obterComandas();
      jQuery('input[name="cdComanda"]').focus().select();
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
      $rootScope.alerta.show('Não foi possível adicionar a comanda!', 'alert-danger');
    });
  };

  this.removerComanda = function(id) {
    $rootScope.loading.load();
    provider.excluir(id).then(function (success) {
      $rootScope.loading.unload();
      $rootScope.alerta.show('Comanda removida!', 'alert-success');
      obterComandas();
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
      $rootScope.alerta.show(error.data.status.description, 'alert-danger');
    });
  };

  this.desativarComanda = function(comanda) {
    comanda.ativo = !comanda.ativo;
    $rootScope.loading.load();
    provider.editar(Comanda.converterEmSaida(comanda)).then(function(success) {
      $rootScope.loading.unload();
      $rootScope.alerta.show('Comanda editada!', 'alert-success');
      obterComandas();
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
      $rootScope.alerta.show(error.data.status.description, 'alert-danger');
    });
  };

}
