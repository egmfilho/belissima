/**
 * Created by egmfilho on 15/03/17.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderRelatorios', ['URLS', function(urls) {

    var url = urls.root + 'report.php?action=:action',
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

        obterFinanceiro: function() {
          return provider.query({
            action: 'receivable'
          }, {
            start_date: new Date('01/01/2001 00:00:00'),
            end_date: new Date('01/01/2020 23:59:59')
          }).$promise;
        }

      }

    }];

  }]);
