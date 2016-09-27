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

        obterTodos: function(contato, contatoPrincipal, endereco, cep, bairro, cidade, enderecoPrincipal, categoria, limite) {
          return provider.query({
            action: 'getList'
          }, {
            get_person_contact: contato,
            get_person_contact_main: contatoPrincipal,
            get_person_address: endereco,
            get_cep: cep,
            get_district: bairro,
            get_city: cidade,
            get_person_address_main: enderecoPrincipal,
            get_person_category: categoria,
            person_limit: limite
          }).$promise;
        },

        obterPessoaPorId: function(id, categoriaId, contato, contatoPrincipal, endereco, cep, bairro, cidade, enderecoPrincipal, categoria) {
          return provider.get({
            action: 'get'
          }, {
            person_id: id,
            person_category_id: categoriaId,
            get_person_contact: contato,
            get_person_contact_main: contatoPrincipal,
            get_person_address: endereco,
            get_cep: cep,
            get_district: bairro,
            get_city: cidade,
            get_person_address_main: enderecoPrincipal,
            get_person_category: categoria
          }).$promise;
        },

        obterPessoaPorCodigo: function(codigo, categoriaId, contato, contatoPrincipal, endereco, cep, bairro, cidade, enderecoPrincipal, categoria) {
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
            get_person_address_main: enderecoPrincipal,
            get_person_category: categoria
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
            get_person_category: categoria,
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
            get_person_category: categoria,
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
            get_person_category: categoria,
            person_category_id: categoriaId
          }).$promise;
        },

        obterPessoasPorNome: function(nome, contato, contatoPrincipal, endereco, cep, bairro, cidade, enderecoPrincipal, categoriaId, categoria) {
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
            get_person_category: categoria,
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
            get_person_category: categoria,
            person_category_id: categoriaId
          }).$promise;
        },

        obterPessoasPorCategoria: function(categoriaId, contato, contatoPrincipal, endereco, cep, bairro, cidade, enderecoPrincipal, categoria) {
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
            get_person_category: categoria,
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
            get_person_category: categoria,
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
            get_person_category: categoria,
            person_category_id: categoriaId
          }).$promise;
        },

        salvarPessoa: function(pessoa) {
          return provider.save({
            action: 'insert'
          }, pessoa).$promise;
        },

        atualizarPessoa: function(pessoa) {
          return provider.save({
            action: 'edit'
          }, pessoa).$promise;
        },

        excluirPessoa: function(pessoa) {
          return provider.save({
            action: 'del'
          }, {
            person_id: pessoa.id
          }).$promise;
        }

      }

    }];

  }]);
