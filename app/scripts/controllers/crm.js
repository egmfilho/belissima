/**
 * Created by egmfilho on 20/12/16.
 */

angular.module('belissimaApp.controllers')
  .controller('CRMCtrl', CRMCtrl);

CRMCtrl.$inject = [ '$rootScope', '$scope', 'ModalBuscarPessoa', 'ProviderPessoa', 'Pessoa' ];

function CRMCtrl($rootScope, $scope, modalBuscarPessoa, providerPessoa, Pessoa) {

  var self = this;

  this.pessoa = new Pessoa();

  this.buscarPessoa = function() {
    modalBuscarPessoa.show().then(function(result) {
      self.pessoa = new Pessoa(result);
      $scope.cdPessoa = self.pessoa.codigo;
    });
  };

  this.buscarPessoaPorCodigo = function(codigo) {
    $rootScope.loading.load();
    providerPessoa.obterPessoaPorCodigo(codigo, null, true, true, true, true, true, true, true, true).then(function(success) {
      self.pessoa = new Pessoa(Pessoa.converterEmEntrada(success.data));
      $scope.cdPessoa = self.pessoa.codigo;
      $rootScope.loading.unload();
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

}
