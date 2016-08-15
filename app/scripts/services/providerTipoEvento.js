/**
 * Created by egmfilho on 28/07/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderTipoEvento', ['URLS', function(urls) {

    var url = urls.root + 'event_type.php?action=:action',
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

        obterTipoDeEventoPorId: function(id) {
          return provider.save({
            action: 'get'
          }, {
            event_type_id: id
          }).$promise;
        },

        obterTiposDeEvento: function() {
          return provider.get({
            action: 'getList'
          }).$promise;
        },

        salvarEvento: function(evento) {
          return provider.save({
            action: 'insert'
          }, evento).$promise;
        },

        editarEvento: function(evento) {
          return provider.save({
            action: 'edit'
          }, evento);
        }

      }

    }];

  }]);
