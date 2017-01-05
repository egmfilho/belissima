/**
 * Created by egmfilho on 23/12/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderComissao', ['URLS', function(urls) {

    var url = urls.root + 'comission.php?action=:action',
        provider = null;

    this.$get = ['$resource', function($resource) {

      provider = $resource(url, {}, {
        get: {
          method: 'POST'
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

      function filtroStatus(status) {
        var s = [];

        angular.forEach(status, function (value, key) {
          if (value) s.push(key.charAt(0).toUpperCase());
        });

        return s.join();
      }

      return {

        obterPorId: function(id) {
          return provider.get({
            action: 'get'
          }, {
            commission_id: id
          }).$promise;
        },

        obterPorCodigo: function(codigo) {
          return provider.get({
            action: 'get'
          }, {
            commission_code: codigo
          }).$promise;
        },

        obterPorFuncionario: function(funcionarioId, limite, filtros) {
          return provider.get({
            action: 'getList'
          }, {
            comission_employee_id: funcionarioId,
            comission_limit: limite,
            get_comission_receivable: true,
            get_comission_document_item: true,
            comission_date_start: filtros.dataInicial,
            comission_date_end: filtros.dataFinal,
            comission_status: filtroStatus(filtros.status)
          }).$promise;
        },

        obterTodos: function(limite) {
          return provider.query({
            action: 'getList'
          }, {
            commission_limit: limite
          }).$promise;
        },

        salvar: function(comissao) {
          return provider.save({
            action: 'insert'
          }, comissao).$promise;
        },

        editar: function(comissao) {
          return provider.save({
            action: 'edit'
          }, comissao).$promise;
        },

        excluir: function (id) {
          return provider.save({
            action: 'del'
          }, {
            card_id: id
          }).$promise;
        }

      }

    }];

  }]);
