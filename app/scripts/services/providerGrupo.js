/**
 * Created by egmfilho on 10/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .provider('ProviderGrupo', ['URLS', function(urls) {

    var url = urls.root + 'product_group.php?action=:action',
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

        obterTodos: function(arvore) {
          return provider.query({
            action: 'getList'
          }, {
            get_product_group_tree: arvore
          }).$promise;
        }
      }

    }];

  }]);
