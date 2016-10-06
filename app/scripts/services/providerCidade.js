/**
 * Created by egmfilho on 06/10/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderCidade', ['URLS', function(urls) {

    var url = urls.root + 'city.php?action=:action',
      provider = null;

    this.$get = ['$resource', function($resource) {

      provider = $resource(url, { }, {
        get: {
          method: 'POST'
        },
        query: {
          method: 'POST',
          isArray: false
        }
      });

      return {

        obterTodos: function(limite) {
          return provider.query({
            action: 'getList'
          }, {
            city_limit: limite
          }).$promise;
        }

      }

    }];

  }]);
