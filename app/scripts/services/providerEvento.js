/**
 * Created by egmfilho on 28/07/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderEvento', ['URLS', function(urls) {

    var url = urls.root + 'event.php?action=:action',
        provider = null;

    this.$get = ['$resource', function($resource) {

      provider = $resource(url, { }, {
        get: {
          method: 'POST',
        },
        query: {
          method: 'POST',
          isArray: false
        },
        save: {
          method: 'POST',
        },
        remove: {
          method: 'POST',
        }
      });

      return {

        obterEventos: function(getTipo, inicio, fim) {
          return provider.query({
            action: 'getList'
          }, {
            get_event_type: getTipo,
            event_start: inicio,
            event_end: fim
          }).$promise;
        },

        obterEventoPorId: function(id, getTipo, getFuncionario, getCliente, getContatos, getContatoPrincipal, getProduto, getGrupoProduto) {
          return provider.get({
            action: 'get'
          }, {
            event_id: id,
            get_event_type: getTipo,
            get_event_employee: getFuncionario,
            get_event_client: getCliente,
            get_person_contact: getContatos,
            get_person_contact_main: getContatoPrincipal,
            get_event_product: getProduto,
            get_product_group: getGrupoProduto
          }).$promise;
        },

        obterPorFuncionario: function(funcionarioId, dataInicial, dataFinal) {
          return provider.query({
            action: 'getList'
          }, {
            event_employee_id: funcionarioId,
            event_start: dataInicial,
            event_end: dataFinal,
            get_event_type: true,
            get_event_client: true,
            get_event_product: true,
            get_person_contact: true,
            get_person_contact_main: true
          }).$promise;
        },

        //obterEventosPorTipo: function(tipoId) {
        //  return provider.query({
        //    action: 'getListByType'
        //  }, {
        //    tipoId: tipoId
        //  }).$promise;
        //},
        //
        //obterEventosPorUsuario: function(usuarioId) {
        //  return provider.query({
        //    action: 'getList'
        //  }).$promise;
        //},
        //
        //obterEventosPorProduto: function(produtoId) {
        //  return provider.query({
        //    action: 'getList'
        //  }).$promise;
        //},
        //
        //obterEventosPorCliente: function(clienteId) {
        //  return provider.query({
        //    action: 'getList'
        //  }).$promise;
        //},
        //
        //obterEventosPorFuncionario: function(funcionarioId) {
        //  return provider.query({
        //    action: 'getList'
        //  }).$promise;
        //},
        //
        //obterEventosPorDataInicial: function(dataInicial) {
        //  return provider.query({
        //    action: 'getList'
        //  }).$promise;
        //},
        //
        //obterEventosPorDataFinal: function(dataFinal) {
        //  return provider.query({
        //    action: 'getList'
        //  }).$promise;
        //},

        apagarEvento: function(id) {
          return provider.remove({
            action: 'del'
          }, {
            event_id: id
          }).$promise;
        },

        salvarEvento: function(evento) {
          return provider.save({
            action: 'insert'
          }, evento).$promise;
        },

        atualizarEvento: function(evento) {
          return provider.save({
            action: 'edit'
          }, evento).$promise;
        }

      }

    }];

  }]);
