/**
 * Created by egmfilho on 13/09/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderTipoContato', ['URLS', function(urls) {

    var url = urls.root + 'person_contact_type.php?action=:action',
      provider = null;

    this.$get = ['$resource', function($resource) {

      provider = $resource(url, {
        get: {
          method: 'POST'
        },
        query: {
          method: 'POST',
          isArray: false
        },
        save: {
          method: 'POST'
        }
      });

      return {

        obterPorId: function(id) {
          return provider.get({
            action: 'get'
          }, {
            person_contact_type_id: id
          }).$promise;
        },

        obterPorNome: function(nome) {
          return provider.query({
            action: 'getList'
          }, {
            person_contact_type_name: nome
          }).$promise;
        },

        obterTodos: function() {
          return provider.get({
            action: 'getList'
          }).$promise;
        },

        salvar: function(tipo) {
          return provider.save({
            action: 'insert'
          }, tipo).$promise;
        },

        editar: function(tipo) {
          return provider.save({
            action: 'edit'
          }, tipo);
        }

      }

    }];

  }]);
