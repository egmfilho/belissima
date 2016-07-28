/**
 * Created by egmfilho on 28/07/16.
 */
angular.module('belissimaApp')
  .provider('ProviderTipoEvento', [function() {

    var url = 'http://172.16.4.17/belissima/public/php/event_type.php?action=:action',
      provider = null;

    this.$get = ['$resource', function($resource) {

      provider = $resource(url, { }, {
        get: {
          method: 'POST',
          isArray: false
        },
        query: {
          method: 'POST',
          isArray: true
        },
        save: {
          method: 'POST',
          isArray: false
        }
      });

      return {

        obterTipoDeEventoPorId: function(id) {
          return provider.get({
            action: 'get'
          },
            $.param({ event_type_id: id })
          ).$promise;
        },

        obterTiposDeEvento: function() {
          return provider.query({
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
