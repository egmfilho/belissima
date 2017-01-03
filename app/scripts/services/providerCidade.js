/**
 * Created by egmfilho on 06/10/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderCidade', ['URLS', function (urls) {

    var url = urls.root + 'city.php?action=:action',
      provider = null;

    this.$get = ['$resource', function ($resource) {

      provider = $resource(url, {}, {
        get: {
          method: 'POST'
        },
        query: {
          method: 'POST',
          isArray: false
        }
      });

      return {

        obterTodos: function (limite) {
          return provider.query({
            action: 'getList'
          }, {
            city_limit: limite
          }).$promise;
        },

        obterPorId: function (id) {
          return provider.get({
            action: 'get'
          }, {
            city_id: id
          }).$promise;
        },

        obterPorCodigo: function (codigo) {
          return provider.get({
            action: 'get'
          }, {
            city_code: codigo
          }).$promise;
        },

        editar: function (cidade) {
          return provider.save({
            action: 'edit'
          }, cidade).$promise;
        },

        adicionar: function (cidade) {
          return provider.save({
            action: 'insert'
          }, cidade).$promise;
        },

        remover: function (id) {
          return provider.save({
            action: 'del'
          }, {
            city_id: id
          }).$promise;
        }

      }

    }];

  }]);
