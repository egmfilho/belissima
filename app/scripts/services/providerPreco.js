/**
 * Created by egmfilho on 09/08/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderPreco', ['URLS', function(urls) {

    var url = urls.root + 'product_price.php?action=:action',
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

        obterPrecoPorId: function(id, getUser) {
          return provider.get({
            action: 'get'
          }, {
            product_price_id: id,
            get_user: getUser
          }).$promise;
        },

        obterPrecoPorCodigo: function(codigo, getUser) {
          return provider.get({
            action: 'get'
          }, {
            product_code: codigo,
            get_user: getUser
          }).$promise;
        },

        obterPrecosPorIdDeProduto: function(idProduto, getUser) {
          return provider.get({
            action: 'getList'
          }, {
            product_id: idProduto,
            get_user: getUser
          }).$promise;
        },

        obterPrecosPorIdDeUsuario: function(idUsuario, getUser) {
          return provider.get({
            action: 'getList'
          }, {
            product_id: idUsuario,
            get_user: getUser
          }).$promise;
        },

        salvarPreco: function(preco) {
          return provider.save({
            action: 'insert'
          }, preco).$promise;
        }

      }

    }];

  }]);
