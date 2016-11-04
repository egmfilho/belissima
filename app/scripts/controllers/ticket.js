/**
 * Created by egmfilho on 21/06/16.
 */
'use strict';

angular.module('belissimaApp.controllers')
  .controller('TicketCtrl', TicketCtrl);

TicketCtrl.$inject = ['$rootScope', '$scope', 'ModalBuscarPessoa', 'Pessoa', 'Pedido', 'ModalBuscarProduto'];

function TicketCtrl($rootScope, $scope, modalBuscarPessoa, Pessoa, Pedido, modalBuscarProduto) {

  var self = this;

  this.novoTicket = new Pedido();

  $scope.$on('$viewContentLoaded', function () {
    // compensa o scroll do tbody no thead se o SO nao for um MacOS
    if (navigator.platform !== 'MacIntel') {
      angular.element('#tabela-ticket thead tr').css('padding-right', '18px');
    }
  });

  function buscarPessoa(categoriaId) {
    modalBuscarPessoa.show(categoriaId).then(function (result) {
      if (result) {
        console.log(result);
        if (categoriaId == $rootScope.categoriaPessoa.cliente.id) {
          self.novoTicket.setCliente(new Pessoa(result));
        } else if (categoriaId == $rootScope.categoriaPessoa.funcionario.id) {
          self.novoTicket.setFuncionario(new Pessoa(result));
        }
      }
      console.log(self.novoTicket);
    });
  }

  $scope.buscarCliente = function () {
    buscarPessoa($rootScope.categoriaPessoa.cliente.id);
  };

  $scope.buscarFuncionario = function () {
    buscarPessoa($rootScope.categoriaPessoa.funcionario.id);
  };

  $scope.buscarProduto = function () {
    modalBuscarProduto.show().then(function (result) {
      console.log(result);
    });
  };
}
