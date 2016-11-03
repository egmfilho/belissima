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
    function ($rootScope, $scope, $filter, providerProduto, providerTipoProduto, providerUnidade, providerGrupo, modalConfirm, modalAlert, modalBuscarPessoa, modalGrupo, modalPreco, modalEditarProduto, Produto, TipoProduto, Unidade) {

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

      $scope.$on('$viewContentLoaded', function () {
        $scope.opcao = 'novo';
        $scope.produto = new Produto();

        $scope.pagination = {
          current: 1,
          max: 15,
          total: 0
        };

        getProdutos();
        getTipos();
        getUnidades();
      });

      $scope.produto = new Produto();

      $scope.editar = function (item) {
        if (item) {
          providerProduto.obterProdutoPorCodigo(item.codigo, true, true).then(function (success) {
            modalEditarProduto.show(new Produto(Produto.converterEmEntrada(success.data)), function (result) {
              getProdutos();
              console.log(result);
            });
          }, function (error) {
            console.log(error);
          });
        }
      };

      function getProdutos() {
        $rootScope.loading.load();
        providerProduto.obterTodos(($scope.pagination.current - 1) * $scope.pagination.max + ',' + $scope.pagination.max).then(function (success) {
          $scope.pagination.total = success.info.product_quantity;
          $scope.produtos = [];
          angular.forEach(success.data, function (item, index) {
            $scope.produtos.push(new Produto(Produto.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      $scope.pageChanged = function () {
        getProdutos();
      };

      function getTipos() {
        $scope.tipos = [];
        $rootScope.loading.load();
        providerTipoProduto.obterTodos().then(function (success) {
          angular.forEach(success.data, function (item, index) {
            $scope.tipos.push(new TipoProduto(TipoProduto.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getUnidades() {
        $scope.unidades = [];
        $rootScope.loading.load();
        providerUnidade.obterTodos().then(function (success) {
          angular.forEach(success.data, function (item, index) {
            $scope.unidades.push(new Unidade(Unidade.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      $scope.getFornecedor = function () {
        // $rootScope.loading.load();
        modalBuscarPessoa.show($rootScope.categoriaPessoa ? $rootScope.categoriaPessoa.fornecedor.id : null, function (result) {
          if (result) {
            $scope.produto.setFornecedor(result);
          }
        });
      };

      $scope.removeFornecedor = function () {
        $scope.produto.removeFornecedor();
      };

      $scope.getGrupo = function () {
        // $rootScope.loading.load();
        modalGrupo.show(function (result) {
          if (result) {
            $scope.produto.setGrupo(result);
          }
        })
      };

      function validar() {

        if (!$scope.produto.nome) {
          $rootScope.alerta.show('Insira o nome do produto/serviço!', 'alert-danger');
          return false;
        }

        if (!$scope.produto.tipoId) {
          $rootScope.alerta.show('Escolha o tipo do produto/serviço!', 'alert-danger');
          return false;
        }

        if (!$scope.produto.grupoId) {
          $rootScope.alerta.show('Escolha o grupo do produto/serviço!', 'alert-danger');
          return false;
        }

        if (!$scope.produto.unidadeId) {
          $rootScope.alerta.show('Insira a unidade do produto/serviço!', 'alert-danger');
          return false;
        }

        if (!$scope.produto.preco.valor) {
          $rootScope.alerta.show('Insira o valor do produto/serviço!', 'alert-danger');
          return false;
        }

        return true;
      }

      $scope.salvar = function () {
        if (!validar()) {
          return;
        }

        console.log(Produto.converterEmSaida($scope.produto));

        modalConfirm.show('Salvar', 'Deseja salvar um novo produto?', 'Sim', 'Não').then(function () {
          $rootScope.loading.load();
          providerProduto.salvarProduto(Produto.converterEmSaida($scope.produto)).then(function (success) {
            $scope.produto = new Produto();
            $rootScope.loading.unload();
            getProdutos();
            modalAlert.show('Sucesso', 'Novo produto salvo!', 'Ok');
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
          });
        });
      };

      $scope.excluir = function (produto) {
        modalConfirm.show('Aviso', 'Deseja excluir o produto/serviço?').then(function () {
          $rootScope.loading.load();
          providerProduto.excluir(produto.id).then(function(success) {
            $rootScope.loading.unload();
            $rootScope.alerta.show('Produto/serviço excluído!', 'alert-success');
            getProdutos();
          }, function(error) {
            console.log(error);
            $rootScope.loading.unload();
          });
        });
      };

      $scope.limpar = function () {
        $scope.produto = new Produto();
      };

    }]);
