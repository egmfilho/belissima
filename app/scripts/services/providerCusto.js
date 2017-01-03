/**
 * Created by egmfilho on 11/08/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderCusto', ['URLS', function(urls) {

    var url = urls.root + 'product_cost.php?action=:action',
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

        obterCustoPorId: function(id, getUser) {
          return provider.get({
            action: 'get'
          }, {
            product_price_id: id,
            get_user: getUser
          }).$promise;
        },

        obterCustoPorCodigo: function(codigo, getUser) {
          return provider.get({
            action: 'get'
          }, {
            product_code: codigo,
            get_user: getUser
          }).$promise;
        },

        obterCustosPorIdDeProduto: function(idProduto, getUser) {
          return provider.get({
            action: 'getList'
          }, {
            product_id: idProduto,
            get_user: getUser
          }).$promise;
        },

        obterCustosPorIdDeUsuario: function(idUsuario, getUser) {
          return provider.get({
            action: 'getList'
          }, {
            product_id: idUsuario,
            get_user: getUser
          }).$promise;
        },

        salvarCusto: function(custo) {
          return provider.save({
            action: 'insert'
          }, custo).$promise;
        }

      }

    }];

  }]);
