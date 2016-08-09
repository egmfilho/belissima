/**
 * Created by egmfilho on 09/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .provider('ProviderTipoProduto', ['URLS', function(urls) {

    var url = urls.root + 'product_type.php?action=:action',
      provider = null;

    this.$get = ['$resource', function($resource) {

      provider = $resource(url, {
        get: {
          method: 'POST',
          isArray: false
        },
        query: {
          method: 'POST',
          isArray: false
        },
        save: {
          method: 'POST'
        }
      });

      return {

        obterTipoDeProdutoPorId: function(id) {
          return provider.save({
            action: 'get'
          }, {
            product_type_id: id
          }).$promise;
        },

        obterTipoDeProdutoPorCodigo: function(codigo) {
          return provider.save({
            action: 'get'
          }, {
            product_type_code: id
          }).$promise;
        },

        obterTodos: function() {
          return provider.get({
            action: 'getList'
          }).$promise;
        },

        salvarTipoProduto: function(tipoProduto) {
          return provider.save({
            action: 'insert'
          }, tipoProduto).$promise;
        },

        editarTipoProduto: function(tipoProduto) {
          return provider.save({
            action: 'edit'
          }, tipoProduto);
        }

      }

    }];

  }]);
