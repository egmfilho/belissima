/**
 * Created by egmfilho on 25/01/17.
 */

'use strict';

angular.module('belissimaApp')
  .controller('ConfigEventosCtrl', ConfigEventosCtrl);

ConfigEventosCtrl.$inject = [ '$rootScope', '$scope', 'ProviderTipoEvento', 'TipoEvento' ];

function ConfigEventosCtrl($rootScope, $scope, provider, TipoEvento) {

  var self = this;

  this.tipos = [];

  this.novo = new TipoEvento();

  function getTipos() {
    self.tipos = [];
    $rootScope.loading.load();
    provider.obterTiposDeEvento().then(function (success) {
      angular.forEach(success.data, function (item, index) {
        self.tipos.push(new TipoEvento(TipoEvento.converterEmEntrada(item)));
      });
      $rootScope.loading.unload();
    }, function (error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  }

  getTipos();

  function salvar(tipoEvento) {
    $rootScope.loading.load();
    provider.salvar(tipoEvento).then(function(success) {
      $rootScope.loading.unload();
      $rootScope.alerta.show('Novo tipo de evento cadastrado', 'alert-success');
      getTipos();
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
      $rootScope.alerta.show('Não foi possível cadastrar o novo tipo de evento!', 'alert-danger');
    });
  }

  function editar(tipoEvento) {
    $rootScope.loading.load();
    provider.editar(tipoEvento).then(function(success) {
      $rootScope.loading.unload();
      $rootScope.alerta.show('Tipo de evento editado!', 'alert-success');
      getTipos();
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
      $rootScope.alerta.show('Não foi possível editar o tipo de evento!', 'alert-danger');
    });
  }

  this.excluir = function (tipoEvento) {
    $rootScope.loading.load();
    provider.excluir(tipoEvento).then(function (success) {
      $rootScope.loading.unload();
      $rootScope.alerta.show('Tipo de evento excluído!', 'alert-success');
      getTipos();
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
      $rootScope.alerta.show('Não foi possível excluir o tipo de evento!', 'alert-danger');
    });
  };

  this.abrirModalTipoEvento = function(tipoEvento) {
    jQuery('#modalTipoEvento').on('show.bs.modal', function(e) {
      self.novo = tipoEvento ? new TipoEvento(tipoEvento) : new TipoEvento();
    }).on('hide.bs.modal', function(e) {
      $scope.picker1 = false;
      $scope.picker2 = false;
    }).modal('show');
  };

  this.salvar = function(tipoEvento) {
    if (!tipoEvento.title || !tipoEvento.color || !tipoEvento.textColor) {
      return;
    }

    if (tipoEvento.color.length != 7 || tipoEvento.textColor.length != 7) {
      return;
    }

    if (!tipoEvento.id) {
      salvar(TipoEvento.converterEmSaida(tipoEvento));
    } else {
      editar(TipoEvento.converterEmSaida(tipoEvento));
    }

    jQuery('#modalTipoEvento').modal('hide');
  };

  this.atualizar = getTipos;
}
