/**
 * Created by egmfilho on 28/07/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderCategoriaPessoa', ['URLS', function(urls) {

    var url = urls.root + 'person_category.php?action=:action',
      provider = null;

    this.$get = ['$resource', function($resource) {

      provider = $resource(url, { }, {
        get: {
          method: 'POST'
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

        obterTodos: function() {
          return provider.query({
            action: 'getList'
          }, { }).$promise;
        }

      }

    }];

  }]);
