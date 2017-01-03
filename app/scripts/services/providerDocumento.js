/**
 * Created by egmfilho on 22/12/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderDocumento', ['URLS', function(urls) {

    var url = urls.root + 'document.php?action=:action',
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
            document_id: id
          }).$promise;
        },

        obterPorCliente: function(clienteId) {
          return provider.query({
            action: 'getList'
          }, {
            document_client_id: clienteId,
            get_document_items: true,
            get_document_payments: true,
            get_document_payment_term: true
          }).$promise;
        }

      }

    }];

  }]);
