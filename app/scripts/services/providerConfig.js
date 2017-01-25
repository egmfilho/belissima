/**
 * Created by egmfilho on 05/10/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderConfig', ['URLS', function (urls) {

    var url = urls.root + 'config.php?action=:action',
      provider = null;

    this.$get = ['$resource', function ($resource) {
      provider = $resource(url, {}, {
        get: {
          method: 'GET'
        }
      });

      return {
        obterPermissoes: function () {
          return provider.get({
            action: 'getJsonAccess'
          }).$promise;
        },

        setViewAgenda: function(nome) {
          return provider.save({
            action: 'setAgendaView'
          }, {
            config_name: 'agenda_view',
            config_value: nome
          }).$promise;
        },

        getViewAgenda: function () {
          return provider.get({
            action: 'getAgendaView'
          }).$promise;
        }
      };

    }];
  }]);
