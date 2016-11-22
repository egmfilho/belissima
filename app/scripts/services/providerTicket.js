/**
 * Created by egmfilho on 22/11/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderTicket', ['URLS', function(urls) {

    var url = urls.root + 'ticket.php?action=:action',
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

        salvar: function(pedido) {
          return provider.save({
            action: 'insert'
          }, pedido).$promise;
        }

      }

    }];

  }]);
