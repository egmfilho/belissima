/**
 * Created by egmfilho on 20/12/16.
 */

angular.module('belissimaApp.controllers')
  .controller('CRMCtrl', CRMCtrl);

CRMCtrl.$inject = [ '$rootScope', '$scope', 'ModalBuscarPessoa', 'ProviderPessoa', 'Pessoa', 'ProviderDocumento', 'Documento'];

function CRMCtrl($rootScope, $scope, modalBuscarPessoa, providerPessoa, Pessoa, providerDocumento, Documento) {

  var self = this;

  this.pessoa = new Pessoa();
  this.historico = [];

  this.buscarPessoa = function() {
    modalBuscarPessoa.show().then(function(result) {
      self.pessoa = new Pessoa(result);
      $scope.cdPessoa = self.pessoa.codigo;
    });
  };

  this.buscarPessoaPorCodigo = function(codigo) {
    $rootScope.loading.load();
    providerPessoa.obterPessoaPorCodigo(codigo, null, true, true, true, true, true, true, null, true).then(function(success) {
      self.pessoa = new Pessoa(Pessoa.converterEmEntrada(success.data));
      $scope.cdPessoa = self.pessoa.codigo;
      $rootScope.loading.unload();
      obterHistorico(self.pessoa.id);
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

}
