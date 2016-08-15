/**
 * Created by egmfilho on 09/08/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderUnidade', ['URLS', function(urls) {

    var url = urls.root + 'product_unit.php?action=:action',
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

        obterTodos: function() {
          return provider.query({
            action: 'getList'
          }, { }).$promise;
        },

        obterUnidadePorId: function(id) {
          return provider.get({
            action: 'get'
          }, {
            product_unit_id: id
          }).$promise;
        },

        obterUnidadePorCodigo: function(codigo) {
          return provider.get({
            action: 'get'
          }, {
            product_unit_code: codigo
          }).$promise;
        },

        obterUnidadesPorNome: function(nome) {
          return provider.query({
            action: 'getList'
          }, {
            product_unit_name: nome
          }).$promise;
        },

        salvarUnidade: function(unidade) {
          return provider.save({

          }, unidade).$promise;
        }

      }

    }];

  }]);
