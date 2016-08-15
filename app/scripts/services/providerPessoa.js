/**
 * Created by egmfilho on 19/07/16.
 */
'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderPessoa', ['URLS', function(urls) {

    var url = urls.root + 'person.php?action=:action',
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

        obterPessoaPorId: function(id, contato, contatoPrincipal, endereco, cep, bairro, cidade, enderecoPrincipal, categoriaId) {
          return provider.get({
            action: 'get'
          }, {
            person_id: id,
            get_person_contact: contato,
            get_person_contact_main: contatoPrincipal,
            get_person_address: endereco,
            get_cep: cep,
            get_district: bairro,
            get_city: cidade,
            get_person_address_main: enderecoPrincipal,
            person_category_id: categoriaId
          }).$promise;
        },

        obterPessoaPorCodigo: function(codigo, categoriaId, contato, contatoPrincipal, endereco, cep, bairro, cidade, enderecoPrincipal) {
          return provider.get({
            action: 'get'
          }, {
            person_code: codigo,
            person_category_id: categoriaId,
            get_person_contact: contato,
            get_person_contact_main: contatoPrincipal,
            get_person_address: endereco,
            get_cep: cep,
            get_district: bairro,
            get_city: cidade,
            get_person_address_main: enderecoPrincipal
          }).$promise;
        },

        obterPessoasPorDocumento: function(documento, contato, contatoPrincipal, endereco, cep, bairro, cidade, enderecoPrincipal, categoriaId) {
          return provider.get({
            action: 'getList'
          }, {
            person_doc: documento,
            get_person_contact: contato,
            get_person_contact_main: contatoPrincipal,
            get_person_address: endereco,
            get_cep: cep,
            get_district: bairro,
            get_city: cidade,
            get_person_address_main: enderecoPrincipal,
            person_category_id: categoriaId
          }).$promise;
        },

        obterPessoasFisicas: function(contato, contatoPrincipal, endereco, cep, bairro, cidade, enderecoPrincipal, categoriaId) {
          return provider.query({
            action: 'getList'
          }, {
            person_type: 'F',
            get_person_contact: contato,
            get_person_contact_main: contatoPrincipal,
            get_person_address: endereco,
            get_cep: cep,
            get_district: bairro,
            get_city: cidade,
            get_person_address_main: enderecoPrincipal,
            person_category_id: categoriaId
          }).$promise;
        },

        obterPessoasJuridicas: function(contato, contatoPrincipal, endereco, cep, bairro, cidade, enderecoPrincipal, categoriaId) {
          return provider.query({
            action: 'getList'
          }, {
            person_type: 'J',
            get_person_contact: contato,
            get_person_contact_main: contatoPrincipal,
            get_person_address: endereco,
            get_cep: cep,
            get_district: bairro,
            get_city: cidade,
            get_person_address_main: enderecoPrincipal,
            person_category_id: categoriaId
          }).$promise;
        },

        obterPessoasPorNome: function(nome, contato, contatoPrincipal, endereco, cep, bairro, cidade, enderecoPrincipal, categoriaId) {
          return provider.query({
            action: 'getList'
          }, {
            person_name: nome,
            get_person_contact: contato,
            get_person_contact_main: contatoPrincipal,
            get_person_address: endereco,
            get_cep: cep,
            get_district: bairro,
            get_city: cidade,
            get_person_address_main: enderecoPrincipal,
            person_category_id: categoriaId
          }).$promise;
        },

        obterPessoasPorApelido: function(apelido, contato, contatoPrincipal, endereco, cep, bairro, cidade, enderecoPrincipal, categoriaId) {
          return provider.query({
            action: 'getList'
          }, {
            person_nickname: apelido,
            get_person_contact: contato,
            get_person_contact_main: contatoPrincipal,
            get_person_address: endereco,
            get_cep: cep,
            get_district: bairro,
            get_city: cidade,
            get_person_address_main: enderecoPrincipal,
            person_category_id: categoriaId
          }).$promise;
        },

        obterPessoasPorCategoria: function(categoriaId, contato, contatoPrincipal, endereco, cep, bairro, cidade, enderecoPrincipal) {
          return provider.query({
            action: 'getList'
          }, {
            person_category_id: categoriaId,
            get_person_contact: contato,
            get_person_contact_main: contatoPrincipal,
            get_person_address: endereco,
            get_cep: cep,
            get_district: bairro,
            get_city: cidade,
            get_person_address_main: enderecoPrincipal,
          }).$promise;
        },

        obterPessoasAtivas: function(contato, contatoPrincipal, endereco, cep, bairro, cidade, enderecoPrincipal, categoriaId) {
          return provider.query({
            action: 'getList'
          }, {
            person_active: 'Y',
            get_person_contact: contato,
            get_person_contact_main: contatoPrincipal,
            get_person_address: endereco,
            get_cep: cep,
            get_district: bairro,
            get_city: cidade,
            get_person_address_main: enderecoPrincipal,
            person_category_id: categoriaId
          }).$promise;
        },

        obterPessoasInativas: function(contato, contatoPrincipal, endereco, cep, bairro, cidade, enderecoPrincipal, categoriaId) {
          return provider.query({
            action: 'getList'
          }, {
            person_active: 'N',
            get_person_contact: contato,
            get_person_contact_main: contatoPrincipal,
            get_person_address: endereco,
            get_cep: cep,
            get_district: bairro,
            get_city: cidade,
            get_person_address_main: enderecoPrincipal,
            person_category_id: categoriaId
          }).$promise;
        },

        salvarPessoa: function(pessoa) {
          return provider.save(pessoa).$promise;
        }

      }

    }];

  }]);
