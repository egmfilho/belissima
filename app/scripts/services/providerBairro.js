/**
 * Created by egmfilho on 06/10/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderBairro', ['URLS', function(urls) {

    var url = urls.root + 'district.php?action=:action',
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
            district_limit: limite,
          }).$promise;
        },

        obterPorId: function(id) {
          return provider.get({
            action: 'get'
          }, {
            district_id: id
          }).$promise;
        },

        obterPorCodigo: function (codigo) {
          return provider.get({
            action: 'get'
          }, {
            district_code: codigo
          }).$promise;
        },

        editar: function(bairro) {
          return provider.save({
            action: 'edit'
          }, bairro).$promise;
        },

        adicionar: function(bairro) {
          return provider.save({
            action: 'insert'
          }, bairro).$promise;
        },

        remover: function(id) {
          return provider.save({
            action: 'del'
          }, {
            district_id: id
          }).$promise;
        }
      }

    }];

  }]);
