/**
 * Created by egmfilho on 19/07/16.
 */
'use strict';

angular.module('belissimaApp')
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

        obterPessoaPorId: function(id, contato, contatoPrincipal, endereco, cep, bairro, cidade) {
          return provider.get({
            action: 'get'
          }, {
            person_id: id,
            get_person_contact: contato,
            get_person_contact_main: contatoPrincipal,
            get_person_address: endereco,
            get_cep: cep,
            get_district: bairro,
            get_city: cidade
          }).$promise;
        },

        obterPessoaPorCodigo: function(codigo, contato, contatoPrincipal, endereco, cep, bairro, cidade) {
          return provider.get({
            action: 'get'
          }, {
            person_code: codigo,
            get_person_contact: contato,
            get_person_contact_main: contatoPrincipal,
            get_person_address: endereco,
            get_cep: cep,
            get_district: bairro,
            get_city: cidade
          }).$promise;
        },

        obterPessoaPorDocumento: function(documento, contato, contatoPrincipal, endereco, cep, bairro, cidade) {
          return provider.get({
            action: 'get'
          }, {
            person_doc: documento,
            get_person_contact: contato,
            get_person_contact_main: contatoPrincipal,
            get_person_address: endereco,
            get_cep: cep,
            get_district: bairro,
            get_city: cidade
          }).$promise;
        },

        obterPessoasFisicas: function(contato, contatoPrincipal, endereco, cep, bairro, cidade) {
          return provider.query({
            action: 'getList'
          }, {
            person_type: 'F',
            get_person_contact: contato,
            get_person_contact_main: contatoPrincipal,
            get_person_address: endereco,
            get_cep: cep,
            get_district: bairro,
            get_city: cidade
          }).$promise;
        },

        obterPessoasJuridicas: function(contato, contatoPrincipal, endereco, cep, bairro, cidade) {
          return provider.query({
            action: 'getList'
          }, {
            person_type: 'J',
            get_person_contact: contato,
            get_person_contact_main: contatoPrincipal,
            get_person_address: endereco,
            get_cep: cep,
            get_district: bairro,
            get_city: cidade
          }).$promise;
        },

        obterPessoasPorNome: function(nome, contato, contatoPrincipal, endereco, cep, bairro, cidade) {
          return provider.query({
            action: 'getList'
          }, {
            person_name: nome,
            get_person_contact: contato,
            get_person_contact_main: contatoPrincipal,
            get_person_address: endereco,
            get_cep: cep,
            get_district: bairro,
            get_city: cidade
          }).$promise;
        },

        obterPessoasPorApelido: function(apelido, contato, contatoPrincipal, endereco, cep, bairro, cidade) {
          return provider.query({
            action: 'getList'
          }, {
            person_nickname: apelido,
            get_person_contact: contato,
            get_person_contact_main: contatoPrincipal,
            get_person_address: endereco,
            get_cep: cep,
            get_district: bairro,
            get_city: cidade
          }).$promise;
        },

        obterPessoasPorCategoria: function(categoriaId, contato, contatoPrincipal, endereco, cep, bairro, cidade) {
          return provider.query({
            action: 'getList'
          }, {
            person_categoryId: categoriaId,
            get_person_contact: contato,
            get_person_contact_main: contatoPrincipal,
            get_person_address: endereco,
            get_cep: cep,
            get_district: bairro,
            get_city: cidade
          }).$promise;
        },

        obterPessoasAtivas: function(contato, contatoPrincipal, endereco, cep, bairro, cidade) {
          return provider.query({
            action: 'getList'
          }, {
            person_active: 'Y',
            get_person_contact: contato,
            get_person_contact_main: contatoPrincipal,
            get_person_address: endereco,
            get_cep: cep,
            get_district: bairro,
            get_city: cidade
          }).$promise;
        },

        obterPessoasInativas: function(contato, contatoPrincipal, endereco, cep, bairro, cidade) {
          return provider.query({
            action: 'getList'
          }, {
            person_active: 'N',
            get_person_contact: contato,
            get_person_contact_main: contatoPrincipal,
            get_person_address: endereco,
            get_cep: cep,
            get_district: bairro,
            get_city: cidade
          }).$promise;
        },

        salvarPessoa: function(pessoa) {
          return provider.save(pessoa).$promise;
        }

      }

    }];

  }]);
