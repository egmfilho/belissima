/**
 * Created by egmfilho on 19/07/16.
 */
'use strict';

angular.module('belissimaApp')
  .provider('ProviderPessoa', ['URLS', function(urls) {

    var url = urls.root + 'person.php?action=:action',
        provider = null;

    this.$get = ['$resource', function($resource) {

      provider = $resource(url, { }, {
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

        obterPessoaPorId: function(id) {
          return provider.get({
            action: 'get'
          }, {
            person_id: id
          }).$promise;
        },

        obterPessoaPorNome: function(nome) {
          return provider.query({

          }).$promise;
        },

        salvarPessoa: function(pessoa) {
          return provider.save(pessoa).$promise;
        }

      }

    }];

  }]);
