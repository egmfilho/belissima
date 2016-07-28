/**
 * Created by egmfilho on 28/07/16.
 */
angular.module('belissimaApp')
  .provider('ProviderEvento', [function() {

    var url = 'http://172.16.4.17/belissima/public/php/event.php?action=:action',
      provider = null;

    this.$get = ['$resource', function($resource) {

      provider = $resource(url, { }, {
        get: {
          method: 'GET',
          isArray: false
        },
        query: {
          method: 'GET',
          isArray: true
        },
        save: {
          method: 'POST',
          isArray: false
        }
      });

      return {

        obterEventoPorId: function(id) {
          return provider.get({
            action: 'get'
          }).$promise;
        },

        obterEventosPorTipo: function(tipoId) {
          return provider.query({
            action: 'getList'
          }).$promise;
        },

        obterEventosPorUsuario: function(usuarioId) {
          return provider.query({
            action: 'getList'
          }).$promise;
        },

        obterEventosPorProduto: function(produtoId) {
          return provider.query({
            action: 'getList'
          }).$promise;
        },

        obterEventosPorCliente: function(clienteId) {
          return provider.query({
            action: 'getList'
          }).$promise;
        },

        obterEventosPorFuncionario: function(funcionarioId) {
          return provider.query({
            action: 'getList'
          }).$promise;
        },

        obterEventosPorDataInicial: function(dataInicial) {
          return provider.query({
            action: 'getList'
          }).$promise;
        },

        obterEventosPorDataFinal: function(dataFinal) {
          return provider.query({
            action: 'getList'
          }).$promise;
        },

        salvarEvento: function(evento) {
          return provider.save({
            action: ''
          }, evento).$promise;
        }

      }

    }];

  }]);
