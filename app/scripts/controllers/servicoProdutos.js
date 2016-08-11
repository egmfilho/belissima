/**
 * Created by egmfilho on 19/07/16.
 */
'use strict';

angular.module('belissimaApp')
  .controller('ServicoProdutosCtrl', [
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
    function($scope, $filter, providerProduto, providerTipoProduto, providerUnidade, providerGrupo, modalConfirm, modalAlert, modalBuscarPessoa, modalGrupo, modalPreco, modalEditarProduto, Produto, TipoProduto, Unidade) {

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

        getTipos();
        getUnidades();
        getProdutos();
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
          });
        }, function(error) {
          console.log(error);
        });
      }

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

      $scope.getGrupo = function() {
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
            providerProduto.salvarProduto(Produto.converterEmSaida($scope.produto)).then(function(success) {
              modalAlert.show('Sucesso', 'Novo produto salvo!', 'Ok');
            }, function(error) {
              console.log(error);
            });
          }
        });
      };

      $scope.limpar = function() {
        $scope.produto = new Produto();
      }

  }]);
