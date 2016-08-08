/**
 * Created by egmfilho on 19/07/16.
 */
'use strict';

angular.module('belissimaApp')
  .controller('ServicoProdutosCtrl', ['$scope', 'ProviderProduto', 'Produto', function($scope, providerProduto, Produto) {

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
      //console.log(angular.element('#tabela-produtos'));
      getProdutos();
    });

    $scope.head = ['Código', 'Nome', 'Descrição'];
    $scope.body = [];

    $scope.teste = function(item) {
      alert(item.nome);
    };

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

  }]);
