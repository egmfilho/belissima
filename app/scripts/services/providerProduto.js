/**
 * Created by egmfilho on 19/07/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .provider('ProviderProduto', ['URLS', function(urls) {

    var url = urls.root + 'product.php?action=:action',
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

        obterTodos: function(limite) {
          return provider.query({
            action: 'getList'
          }, {
            product_limit: limite
          }).$promise;
        },

        obterProdutoPorId: function(id, getFornecedor) {
          return provider.get({
            action: 'get'
          }, {
            product_id: id,
            get_provider: getFornecedor
          }).$promise;
        },

        obterProdutoPorCodigo: function(codigo, getGrupo, getFornecedor) {
          return provider.get({
            action: 'get'
          }, {
            product_code: codigo,
            get_product_group: getGrupo,
            get_product_provider: getFornecedor,
            get_product_unit: true
          }).$promise;
        },

        obterProdutosPorNome: function(nome, limite) {
          return provider.query({
            action: 'getList'
          }, {
            product_name: nome,
            product_limit: limite
          }).$promise;
        },

        salvarProduto: function(produto) {
          return provider.save({
            action: 'insert'
          }, produto).$promise;
        },

        excluir: function(id) {
          return provider.save({
            action: 'del'
          }, {
            product_id: id
          }).$promise;
        },

        atualizarProduto: function(produto) {
          return provider.save({
            action: 'edit'
          }, produto).$promise;
        }

      }

    }];

  }]);
