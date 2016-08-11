/**
 * Created by egmfilho on 11/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .controller('ModalEditarProdutoCtrl', [
    '$scope',
    '$uibModalInstance',
    'ModalBuscarPessoa',
    'ModalConfirm',
    'ModalAlert',
    'ModalGrupo',
    'ModalPreco',
    'ModalCusto',
    'ProviderTipoProduto',
    'ProviderUnidade',
    'ProviderPessoa',
    'ProviderProduto',
    'TipoProduto',
    'Unidade',
    'Pessoa',
    'Produto',
    'produto',
    function($scope, $uibModalInstance, modalBuscarPessoa, modalConfirm, modalAlert, modalGrupo, modalPreco, modalCusto, providerTipoProduto, providerUnidade, providerPessoa, providerProduto, TipoProduto, Unidade, Pessoa, Produto, produto) {

      $uibModalInstance.opened.then(function() {

        $scope.produto = new Produto(produto);
        getTipos();
        getUnidades();

      });

      function getTipos() {
        $scope.tipos = [ ];
        providerTipoProduto.obterTodos().then(function(success) {
          angular.forEach(success.data, function(item, index) {
            $scope.tipos.push(new TipoProduto(TipoProduto.converterEmEntrada(item)));
          });
        }, function(error) {
          console.log(error);
        });
      }

      function getUnidades() {
        $scope.unidades = [ ];
        providerUnidade.obterTodos().then(function(success) {
          angular.forEach(success.data, function(item, index) {
            $scope.unidades.push(new Unidade(Unidade.converterEmEntrada(item)));
          });
        }, function(error) {
          console.log(error);
        });
      }

      $scope.getFornecedor = function() {
        modalBuscarPessoa.show($scope.categoriaPessoa.fornecedor, function(result) {
          if (result) {
            $scope.produto.setFornecedor(result);
          }
        });
      };

      $scope.removeFornecedor = function() {
        $scope.produto.removeFornecedor();
      };

      $scope.abrirPrecos = function() {
        modalPreco.show($scope.produto, function(result) {
          if (result) {
            if (!angular.equals($scope.produto.preco, result)) {
              $scope.produto.setPreco(result);
            }
          }
        });
      };

      $scope.abrirCustos = function() {
        modalCusto.show($scope.produto, function(result) {
          if (result) {
            if (!angular.equals($scope.produto.custo, result)) {
              $scope.produto.setCusto(result);
            }
          }
        })
      };

      $scope.getGrupo = function() {
        modalGrupo.show(function(result) {
          if (result) {
            $scope.produto.setGrupo(result);
          }
        })
      };

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

      $scope.ok = function() {
        //var erros = validar();
        //
        //if (!erros) {
        modalConfirm.show('Aviso', 'Salvar as alterações?', 'Sim', 'Não', function(result) {
          if (result) {
            providerProduto.atualizarProduto(Produto.converterEmSaida($scope.produto)).then(function(success) {
              modalAlert.show('Successo', 'Produto atualizado com sucesso!', 'Ok', function() {
                $uibModalInstance.close();
              });
            }, function(error) {
              console.log(error);
            });
          }
        });
        //} else {
        //  modalAlert.show('Erro', erros, 'Ok');
        //}

        console.log($scope.produto);
      };

      $scope.excluir = function() {
        modalConfirm.show('Aviso', 'Deseja excluir o evento?', 'Sim', 'Não', function(result) {
          if (result) {
            $uibModalInstance.close('excluir');
          }
        });
      };

      $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
      };

    }]);
