/**
 * Created by egmfilho on 19/07/16.
 */
'use strict';

angular.module('belissimaApp.controllers')
  .controller('ServicoProdutosCtrl', [
    '$rootScope',
    '$scope',
    '$filter',
    'ProviderProduto',
    'ProviderTipoProduto',
    'ProviderUnidade',
    'ProviderGrupo',
    'ModalConfirm',
    'ModalAlert',
    'ModalBuscarPessoa',
    'ModalGrupo',
    'ModalPreco',
    'ModalEditarProduto',
    'Produto',
    'TipoProduto',
    'Unidade',
    function($rootScope, $scope, $filter, providerProduto, providerTipoProduto, providerUnidade, providerGrupo, modalConfirm, modalAlert, modalBuscarPessoa, modalGrupo, modalPreco, modalEditarProduto, Produto, TipoProduto, Unidade) {

      //function compensaScrollsNaTabela() {
      //
      //  var tabela = angular.element('#tabela-produtos');
      //
      //  if (navigator.platform !== 'MacIntel') {
      //    angular.element('#tabela-produtos thead tr').css('padding-right', '18px');
      //  }
      //
      //  console.log(parseInt(tabela.css('width')));
      //  console.log(parseInt(tabela.css('min-width')));
      //
      //  if (parseInt(tabela.css('width')) <= parseInt(tabela.css('min-width'))) {
      //    console.log('teste');
      //    angular.element('#tabela-produtos > tbody').css('padding-bottom', '18px');
      //  }
      //}

      $scope.$on('$viewContentLoaded', function() {
        $scope.opcao = 'novo';
        $scope.produto = new Produto();
        $scope.head = [ 'Código', 'Nome', 'Descrição', 'Preço', 'Custo', 'Ativo' ];
        $scope.body = [ ];

        getProdutos();
        getTipos();
        getUnidades();
      });

      $scope.produto = new Produto();

      $scope.editar = function(item) {
        if (item) {
          providerProduto.obterProdutoPorCodigo(item.codigo, true, true).then(function(success) {
            modalEditarProduto.show(new Produto(Produto.converterEmEntrada(success.data)), function(result) {
              console.log(result);
            });
          }, function(error) {
            console.log(error);
          });
        }
      };

      $scope.excluir = function(item) {
        alert('Excluir: ' + item.codigo);
      };

      function getProdutos() {
        $rootScope.isLoading = true;
        providerProduto.obterTodos().then(function(success) {
          $scope.produtos = [ ];
          angular.forEach(success.data, function(item, index) {
            var produto = new Produto(Produto.converterEmEntrada(item));
            $scope.body.push({
              codigo: produto.codigo,
              nome: produto.nome,
              descricao: produto.descricao,
              preco: $filter('currency')(produto.preco.valor, 'R$ '),
              custo: $filter('currency')(produto.custo.valor, 'R$ '),
              ativo: produto.ativo ? 'Sim' : 'Não'
            });
            //$rootScope.isLoading = false;
          });
        }, function(error) {
          console.log(error);
          //$rootScope.isLoading = false;
        });
      }

      function getTipos() {
        $scope.tipos = [ ];
        $rootScope.isLoading = true;
        providerTipoProduto.obterTodos().then(function(success) {
          angular.forEach(success.data, function(item, index) {
            $scope.tipos.push(new TipoProduto(TipoProduto.converterEmEntrada(item)));
          });
          //$rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          //$rootScope.isLoading = false;
        });
      }

      function getUnidades() {
        $scope.unidades = [ ];
        $rootScope.isLoading = true;
        providerUnidade.obterTodos().then(function(success) {
          angular.forEach(success.data, function(item, index) {
            $scope.unidades.push(new Unidade(Unidade.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

      $scope.getFornecedor = function() {
        $rootScope.isLoading = true;
        modalBuscarPessoa.show($rootScope.categoriaPessoa ? $rootScope.categoriaPessoa.fornecedor.id : null, function(result) {
          if (result) {
            $scope.produto.setFornecedor(result);
          }
        });
      };

      $scope.removeFornecedor = function() {
        $scope.produto.removeFornecedor();
      };

      $scope.getGrupo = function() {
        $rootScope.isLoading = true;
        modalGrupo.show(function(result) {
          if (result) {
            $scope.produto.setGrupo(result);
          }
        })
      };

      $scope.enviar = function() {
        console.log(Produto.converterEmSaida($scope.produto));

        modalConfirm.show('Salvar', 'Deseja salvar um novo produto?', 'Sim', 'Não', function(result) {
          if (result) {
            $rootScope.isLoading = true;
            providerProduto.salvarProduto(Produto.converterEmSaida($scope.produto)).then(function(success) {
              $rootScope.isLoading = false;
              modalAlert.show('Sucesso', 'Novo produto salvo!', 'Ok');
            }, function(error) {
              console.log(error);
              $rootScope.isLoading = false;
            });
          }
        });
      };

      $scope.limpar = function() {
        $scope.produto = new Produto();
      };

  }]);
