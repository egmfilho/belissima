/**
 * Created by egmfilho on 20/12/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderMovimentacao', ['URLS', function(urls) {

    var url = urls.root + 'product_movement.php?action=:action',
      provider = null;

    this.$get = ['$resource', function($resource) {

      provider = $resource(url, {}, {
        get: {
          method: 'POST'
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

        obterPorId: function() {
          return provider.get({
            action: 'get'
          }, {

          }).$promise;
        },

        obterPorCodigo: function(codigo) {
          return provider.get({
            action: 'get'
          }, {
            ticket_code: codigo
          }).$promise;
        },

        obterTodos: function(limite) {
          return provider.query({
            action: 'getList'
          }, {
            ticket_limit: limite
          }).$promise;
        },

        salvar: function(movimentacao) {
          return provider.save({
            action: 'insert'
          }, movimentacao).$promise;
        },

        editar: function(movimentacao) {
          return provider.save({
            action: 'edit'
          }, movimentacao).$promise;
        }

      }

    }];

  }]);
