/**
 * Created by egmfilho on 09/11/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderFormaPagamento', ProviderFormaPagamento);

ProviderFormaPagamento.$inject = [ 'URLS' ];

function ProviderFormaPagamento(urls) {
  var url = urls.root + 'payment_mode.php?action=:action',
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

      obterTodos: function(limite) {
        return provider.query({
          action: 'getList'
        }, {
          payment_mode_limit: limite
        }).$promise;
      },

      obterPorId: function(id) {
        return provider.get({
          action: 'get'
        }, {
          payment_mode_id: id
        }).$promise;
      },

      obterPorCodigo: function(codigo) {
        return provider.get({
          action: 'get'
        }, {
          payment_mode_code: codigo
        }).$promise;
      },

      salvar: function(forma) {
        return provider.save({
          action: 'insert'
        }, forma).$promise;
      },

      editar: function(forma) {
        return provider.save({
          action: 'edit'
        }, forma).$promise;
      },

      excluir: function(forma) {
        return provider.save({
          action: 'del'
        }, forma).$promise;
      }

    }
  }];
}
