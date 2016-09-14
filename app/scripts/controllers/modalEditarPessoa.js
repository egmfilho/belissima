/**
 * Created by egmfilho on 14/09/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('ModalEditarPessoaCtrl', [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'ProviderPessoa',
    'ProviderTipoContato',
    'TipoContato',
    'Pessoa',
    'ModalConfirm',
    'TiposLogradouros',
    'pessoa',
    function($rootScope, $scope, $uibModalInstance, provider, providerTipoContato, TipoContato, Pessoa, modalConfirm, TiposLogradouros, pessoa) {

      $uibModalInstance.opened.then(function() {
        console.log(pessoa);
        $scope.pessoa = new Pessoa(pessoa);
        $scope.tipos_logradouros = TiposLogradouros;

        getTiposContato();
      });

      function getTiposContato() {
        $scope.tipos_contatos = [ ];
        $rootScope.isLoading = true;
        providerTipoContato.obterTodos().then(function(success) {
          angular.forEach(success.data, function(item, index) {
            $scope.tipos_contatos.push(new TipoContato(TipoContato.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

      function validar() {
        if (!$scope.evento.title) {
          return 'Digite um título!';
        }

        if (!$scope.data) {
          return 'Verifique a data!';
        }

        if (!$scope.evento.start) {
          return 'Verifique a hora de início!';
        }

        if (!$scope.evento.end) {
          return 'Verifique a hora de término!';
        }

        $scope.setData();

        if (!$scope.evento.tipoId) {
          return 'Selecione um tipo de evento!';
        }

        return null;
      }

      $scope.salvar = function() {
        //var erros = validar();
        //
        //if (!erros) {
        modalConfirm.show('Aviso', 'Salvar as alterações?', 'Sim', 'Não', function(result) {
          if (result) {
            //providerProduto.atualizarProduto(Produto.converterEmSaida($scope.produto)).then(function(success) {
            //  modalAlert.show('Successo', 'Produto atualizado com sucesso!', 'Ok', function() {
            //    $uibModalInstance.close();
            //  });
            //}, function(error) {
            //  console.log(error);
            //});
            $rootScope.isLoading = true;
            provider.atualizarPessoa($scope.pessoa).then(function(success) {
              console.log(success);
              alert('Atualizado');
              $rootScope.isLoading = false;
            }, function(error) {
              console.log(error);
              $rootScope.isLoading = false;
            });
          } else {

          }
        });
      };

      $scope.excluir = function() {
        modalConfirm.show('Aviso', 'Deseja excluir esta pessoa?', 'Sim', 'Não', function(result) {
          if (result) {
            $uibModalInstance.close('excluir');
          }
        });
      };

      $scope.fechar = function() {
        $uibModalInstance.dismiss('cancel');
      };

    }]);
