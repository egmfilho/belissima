/**
 * Created by egmfilho on 05/12/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderPDV', ['URLS', function(urls) {

    var url = urls.root + 'pdv.php?action=:action',
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

        salvar: function(preco) {
          return provider.save({
            action: 'insert'
          }, preco).$promise;
        }

      }

    }];

  }]);
