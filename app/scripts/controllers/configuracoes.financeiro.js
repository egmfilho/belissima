/**
 * Created by egmfilho on 09/11/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('FinanceiroCtrl', FinanceiroCtrl);

FinanceiroCtrl.$inject = [
  '$rootScope',
  '$scope',
  'ProviderFormaPagamento',
  'FormaPagamento',
  'ProviderPrazoPagamento',
  'PrazoPagamento'
];

function FinanceiroCtrl($rootScope, $scope, providerForma, FormaPagamento, providerPrazo, PrazoPagamento) {

  var self = this;

  this.formas = [];
  this.forma = new FormaPagamento();
  this.prazos = [];
  this.prazo = new PrazoPagamento();

  this.paginationFormas = {
    current: 1,
    max: 15,
    total: 0,
    pageChanged: function () {
      getFormas();
    }
  };

  this.paginationPrazos = {
    current: 1,
    max: 15,
    total: 0,
    pageChanged: function () {
      getPrazos();
    }
  };

  function getFormas() {
    $rootScope.loading.load();
    self.formas = [ ];
    providerForma.obterTodos().then(function(success) {
      angular.forEach(success.data, function(item, index) {
        self.formas.push(new FormaPagamento(FormaPagamento.converterEmEntrada(item)));
      });
      $rootScope.loading.unload();
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  }

  function getPrazos() {
    $rootScope.loading.load();
    self.prazos = [ ];
    providerPrazo.obterTodos().then(function(success) {
      angular.forEach(success.data, function(item, index) {
        self.prazos.push(new PrazoPagamento(PrazoPagamento.converterEmEntrada(item)));
      });
      $rootScope.loading.unload();
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  }

  getFormas();
  getPrazos();
  this.atualizarFormas = getFormas;
  this.atualizarPrazos = getPrazos;

  jQuery('#financeiro').on('hidden.bs.modal', '#modalForma', function(e) {
    self.forma = new FormaPagamento();
    $scope.$apply();
  }).on('hidden.bs.modal', '#modalPrazo', function(e) {
    self.prazo = new PrazoPagamento();
    $scope.$apply();
  });

  this.editarForma = function(forma) {
    self.forma = new FormaPagamento(forma);
    jQuery('#modalForma').modal('show');
  };

  this.excluirForma = function(forma) {
    $rootScope.loading.load();
    providerForma.excluir(FormaPagamento.converterEmSaida(forma)).then(function(success) {
      $rootScope.loading.unload();
      $rootScope.alerta.show('Forma de pagamento excluída!', 'alert-success');
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
      $rootScope.alerta.show('Não foi possível excluir!', 'alert-danger');
    });
  };

  this.salvarForma = function() {
    if (!self.forma.descricao) {
      $rootScope.alerta.show('Preencha a descrição!', 'alert-danger');
      return;
    }

    console.log(self.forma);

    $rootScope.loading.load();
    if (self.forma.id) {
      providerForma.editar(FormaPagamento.converterEmSaida(self.forma)).then(function (success) {
        jQuery('#modalForma').modal('hide');
        $rootScope.loading.unload();
        getFormas();
        $rootScope.alerta.show('Forma de pagamento editada!', 'alert-success');
      }, function (error) {
        console.log(error);
        $rootScope.loading.unload();
        $rootScope.alerta.show('Não foi possível salvar as alterações!', 'alert-danger');
      });
    } else {
      providerForma.salvar(FormaPagamento.converterEmSaida(self.forma)).then(function (success) {
        jQuery('#modalForma').modal('hide');
        $rootScope.loading.unload();
        getFormas();
        $rootScope.alerta.show('Forma de pagamento salva!', 'alert-success');
      }, function (error) {
        console.log(error);
        $rootScope.loading.unload();
        $rootScope.alerta.show('Não foi possível salvar!', 'alert-danger');
      });
    }
  };

  this.editarPrazo = function(prazo) {
    self.prazo = new PrazoPagamento(prazo);
    jQuery('#modalPrazo').modal('show');
  };

  this.excluirPrazo = function(prazo) {
    $rootScope.loading.load();
    providerPrazo.excluir(PrazoPagamento.converterEmSaida(prazo)).then(function(success) {
      $rootScope.loading.unload();
      $rootScope.alerta.show('Prazo de pagamento excluída!', 'alert-success');
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
      $rootScope.alerta.show('Não foi possível excluir!', 'alert-danger');
    });
  };

  this.salvarPrazo = function() {
    if (!self.prazo.descricao) {
      $rootScope.alerta.show('Preencha a descrição!', 'alert-danger');
      return;
    }

    if (self.prazo.parcelas <= 0) {
      $rootScope.alerta.show('Informe corretamente o número de parcelas!', 'alert-danger');
      return;
    }

    if (self.prazo.iniciaEm < 0 || self.prazo.intervalo < 0) {
      $rootScope.alerta.show('A quantidade de dias não pode ser menor que 0!', 'alert-danger');
      return;
    }

    console.log(self.prazo);

    $rootScope.loading.load();
    if (self.prazo.id) {
      providerPrazo.editar(PrazoPagamento.converterEmSaida(self.prazo)).then(function(success) {
        jQuery('#modalPrazo').modal('hide');
        $rootScope.loading.unload();
        getPrazos();
        $rootScope.alerta.show('Prazo de pagamento editado!', 'alert-success');
      }, function(error) {
        console.log(error);
        $rootScope.loading.unload();
        $rootScope.alerta.show('Não foi possível salvar as alterações!', 'alert-danger');
      });
    } else {
      providerPrazo.salvar(PrazoPagamento.converterEmSaida(self.prazo)).then(function(success) {
        jQuery('#modalPrazo').modal('hide');
        $rootScope.loading.unload();
        getPrazos();
        $rootScope.alerta.show('Prazo de pagamento salvo!', 'alert-success');
      }, function(error) {
        console.log(error);
        $rootScope.loading.unload();
        $rootScope.alerta.show('Não foi possível salvar!', 'alert-danger');
      });
    }
  };
}
