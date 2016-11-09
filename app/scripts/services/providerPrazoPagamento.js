/**
 * Created by egmfilho on 09/11/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderPrazoPagamento', ProviderPrazoPagamento);

ProviderPrazoPagamento.$inject = [ 'URLS' ];

function ProviderPrazoPagamento(urls) {
  var url = urls.root + 'payment_term.php?action=:action',
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

      obterTodos: function() {
        return provider.query({
          action: 'getList'
        }, { }).$promise;
      },

      obterPorId: function(id) {
        return provider.get({
          action: 'get'
        }, {
          payment_term_id: id
        }).$promise;
      },

      obterPorCodigo: function(codigo) {
        return provider.get({
          action: 'get'
        }, {
          payment_term_code: codigo
        }).$promise;
      },

      salvar: function(prazo) {
        return provider.save({
          action: 'insert'
        }, prazo).$promise;
      },

      editar: function(prazo) {
        return provider.save({
          action: 'edit'
        }, prazo).$promise;
      },

      excluir: function(prazo) {
        return provider.save({
          action: 'del'
        }, prazo).$promise;
      }

    }
  }];
}

