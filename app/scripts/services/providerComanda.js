/**
 * Created by egmfilho on 20/12/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderComanda', ['URLS', function(urls) {

    var url = urls.root + 'ticket.php?action=:action',
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

        salvar: function(comanda) {
          return provider.save({
            action: 'insert'
          }, comanda).$promise;
        },

        editar: function(comanda) {
          return provider.save({
            action: 'edit'
          }, comanda).$promise;
        }

      }

    }];

  }]);
