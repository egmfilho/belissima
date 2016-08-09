/**
 * Created by egmfilho on 19/07/16.
 */

'use strict';

angular.module('belissimaApp')
  .provider('ProviderProduto', ['URLS', function(urls) {

    var url = urls.root + 'product.php?action=:action',
        provider = null;

    this.$get = ['$resource', function($resource) {

      provider = $resource(url, {}, {
        get: {
          method: 'POST',
          isArray: false
        },
        query: {
          method: 'POST',
          isArray: false
        },
        save: {
          method: 'POST',
          isArray: false
        }
      });

      return {

        obterTodos: function() {
          return provider.query({
            action: 'getList'
          }, { }).$promise;
        },

        obterProdutoPorId: function(id, getFornecedor) {
          return provider.get({
            action: 'get'
          }, {
            product_id: id,
            get_provider: getFornecedor
          }).$promise;
        },

        obterProdutoPorCodigo: function(codigo, getFornecedor) {
          return provider.get({
            action: 'get'
          }, {
            product_code: codigo,
            get_provider: getFornecedor
          }).$promise;
        },

        obterProdutosPorNome: function(nome) {
          return provider.query({
            action: 'getList'
          }, {
            product_name: nome
          }).$promise;
        },

        salvarProduto: function(produto) {
          return provider.save({

          }, produto).$promise;
        }

      }

    }];

  }]);
