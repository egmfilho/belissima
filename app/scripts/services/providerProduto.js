/**
 * Created by egmfilho on 19/07/16.
 */
'use strict';

angular.module('belissimaApp')
  .provider('ProviderProduto', ['URLS', function(urls) {

    var url = urls.root + '',
        provider = null;

    this.$get = ['$resource', function($resource) {

      provider = $resource(url, {}, {
        get: {
          method: 'GET',
          isArray: false
        },
        query: {
          method: 'GET',
          isArray: true
        },
        save: {
          method: 'POST',
          isArray: false
        }
      });

      return {

        obterProdutoPorCodigo: function(codigo) {
          return provider.get({

          }).$promise;
        },

        obterProdutosProDescricao: function(descricao) {
          return provider.query({

          }).$promise;
        },

        salvarProduto: function(produto) {
          return provider.save(produto).$promise;
        }

      }

    }];

  }]);
