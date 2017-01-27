/**
 * Created by egmfilho on 27/01/17.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderTabelaDesconto', ['URLS', function(urls) {

    var url = urls.root + 'discount_table.php?action=:action',
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

        obterTodos: function() {
          return provider.query({
            action: 'getList'
          }, { }).$promise;
        },

        salvar: function(desconto) {
          return provider.save({
            action: 'insert'
          }, desconto).$promise;
        },

        editar: function(desconto) {
          return provider.save({
            action: 'edit'
          }, desconto).$promise;
        },

        excluir: function(id) {
          return provider.save({
            action: 'del'
          }, {
            discount_table_id: id
          }).$promise;
        }

      }

    }];

  }]);
