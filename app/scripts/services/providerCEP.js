/**
 * Created by egmfilho on 13/09/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderCEP', ['URLS', function (urls) {

    var url = urls.root + 'cep.php?action=:action',
      provider = null;

    this.$get = ['$resource', function ($resource) {

      provider = $resource(url, {}, {
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

        obterTodos: function (bairro, cidade, limite) {
          return provider.query({
            action: 'getList'
          }, {
            get_district: bairro,
            get_city: cidade,
            cep_limit: limite
          }).$promise;
        },

        obterPorId: function (id, bairro, cidade) {
          return provider.get({
            action: 'get'
          }, {
            person_contact_type_id: id,
            get_district: bairro,
            get_city: cidade
          }).$promise;
        },

        obterPorCodigo: function (codigo, bairro, cidade) {
          return provider.get({
            action: 'getList'
          }, {
            cep_code: codigo,
            get_district: bairro,
            get_city: cidade
          }).$promise;
        },

        obterPorLogradouro: function (logradouro, bairro, cidade, limite) {
          return provider.get({
            action: 'getList'
          }, {
            'cep_public_place': logradouro,
            get_district: bairro,
            get_city: cidade,
            cep_limit: limite
          }).$promise;
        },

        adicionar: function (cep) {
          return provider.save({
            action: 'insert'
          }, cep).$promise;
        },

        editar: function (cep) {
          return provider.save({
            action: 'edit'
          }, cep).$promise;
        },

        remover: function (id) {
          return provider.save({
            action: 'del'
          }, {
            cep_id: id
          }).$promise;
        }

      }

    }];

  }]);

