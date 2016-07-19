/**
 * Created by egmfilho on 19/07/16.
 */
'use strict';

angular.module('belissimaApp')
  .provider('ProviderPessoa', [function() {

    var url = '',
        provider = null;

    this.$get = ['$resource', function($resource) {

      provider = $resource(url, { }, {
        get: {
          method: 'GET',
          isArray: false
        },
        query: {
          method: 'GET',
          isArray: true
        },
        save: {
          method: 'POST',
          isArray: false
        }
      });

      return {

        obterPessoaPorId: function(id) {
          return provider.get({

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
