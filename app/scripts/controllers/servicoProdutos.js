/**
 * Created by egmfilho on 19/07/16.
 */
'use strict';

angular.module('belissimaApp')
  .controller('ServicoProdutosCtrl', [
    '$scope',
    'ProviderProduto',
    'ProviderTipoProduto',
    'ProviderUnidade',
    'ProviderGrupo',
    'ModalBuscarPessoa',
    'ModalGrupo',
    'ModalPreco',
    'Produto',
    'TipoProduto',
    'Unidade',
    function($scope, providerProduto, providerTipoProduto, providerUnidade, providerGrupo, modalBuscarPessoa, modalGrupo, modalPreco, Produto, TipoProduto, Unidade) {

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
        $scope.head = [ 'Data', 'Usuário', 'Valor' ];
        $scope.body = [ ];

        getTipos();
        getUnidades();
        getProdutos();
      });

      $scope.produto = new Produto();

      //$scope.abrirPrecos = function() {
      //  modalPreco.show($scope.produto, function(result) {
      //    if (result) {
      //      $scope.produto.setPreco(result);
      //    }
      //  });
      //};

      //$scope.editar = function(item) {
      //  if (item) {
      //    providerProduto.obterProdutoPorCodigo(item.codigo).then(function(success) {
      //      $scope.produto = new Produto(Produto.converterEmEntrada(success.data));
      //    }, function(error) {
      //      console.log(error);
      //    });
      //  }
      //};

      //$scope.excluir = function(item) {
      //  alert('Excluir: ' + item.codigo);
      //};

      function getProdutos() {
        providerProduto.obterTodos().then(function(success) {
          $scope.produtos = [ ];
          angular.forEach(success.data, function(item, index) {
            var produto = new Produto(Produto.converterEmEntrada(item));
            $scope.body.push({
              codigo: produto.codigo,
              nome: produto.nome,
              descricao: produto.descricao
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

      };

      $scope.getGrupo = function() {
        console.log('getGrupo');
        modalGrupo.show(function(result) {
          if (result) {
            $scope.produto.setGrupo(result);
          }
        })
      };

      $scope.enviar = function() {
        console.log(Produto.converterEmSaida($scope.produto));
      };

  }]);
