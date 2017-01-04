/**
 * Created by egmfilho on 22/11/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderTicket', ['URLS', function(urls) {

    var url = urls.root + 'ticket.php?action=:action',
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

        obterPorId: function() {
          return provider.get({
            action: 'get'
          }, {

          }).$promise;
        },

        obterPorCodigo: function(codigo) {
          return provider.get({
            action: 'get'
          }, {
            ticket_code: codigo,
            get_ticket_client: true,
            get_ticket_items: true,
            get_ticket_items_product: true,
            get_ticket_items_employee: true,
            get_ticket_payment_term: true,
            get_payment_mode: true,
            get_ticket_payments: true,
            get_ticket_payment_mode: true,
            get_product_unit: true,
            get_ticket_card: true
          }).$promise;
        },

        obterTodos: function(getUser, getCliente, getItems, getProdutos, getFuncionarios, getPrazo, getPagamento, getFormasPagamento, statusId, limite) {
          return provider.query({
            action: 'getList'
          }, {
            get_ticket_user: getUser,
            get_ticket_client: getCliente,
            get_ticket_items: getItems,
            get_ticket_items_product: getProdutos,
            get_ticket_items_employee: getFuncionarios,
            get_ticket_payment_term: getPrazo,
            get_ticket_payments: getPagamento,
            get_ticket_payment_mode: getFormasPagamento,
            ticket_status_id: statusId,
            ticket_limit: limite
          }).$promise;
        },

        abrirComanda: function(codigoDeBarras) {
          return provider.get({
            action: 'get'
          }, {
            card_code_bar: codigoDeBarras
          }).$promise;
        },

        salvar: function(pedido) {
          return provider.save({
            action: 'insert'
          }, pedido).$promise;
        },

        editar: function(pedido) {
          return provider.save({
            action: 'edit'
          }, pedido).$promise;
        },

        excluir: function(id) {
          return provider.save({
            action: 'del'
          }, {
            ticket_id: id
          }).$promise;
        }

      }

    }];

  }]);
