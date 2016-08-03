/**
 * Created by egmfilho on 28/07/16.
 */
angular.module('belissimaApp')
  .provider('ProviderEvento', ['URLS', function(urls) {

    var url = urls.root + 'event.php?action=:action',
        provider = null;

    this.$get = ['$resource', function($resource) {

      provider = $resource(url, { }, {
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

        obterEventos: function(getTipo) {
          return provider.query({
            action: 'getList'
          }, {
            get_event_type: getTipo
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

        salvarEvento: function(evento) {
          return provider.save({
            action: ''
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
