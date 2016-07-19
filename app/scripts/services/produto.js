/**
 * Created by egmfilho on 19/07/16.
 */
'use strict';

angular.module('belissimaApp')
  .factory('Produto', function() {

    var produto;

    return {
      novoProduto: function(codigo, descricao, custo, comissao) {
        produto.dataCadastro = new Date();
        produto.codigo = codigo;
        produto.descricao = descricao;
        produto.custo = custo;
        produto.comissao = comissao;
      },

      setTipo: function(tipo) {
        produto.tipo = tipo;
      },

      setGrupo: function(grupo) {
        produto.grupo = grupo;
      },

      setUnidade: function(unidade) {
        produto.unidade = unidade;
      },

      setFornecedor: function(fornecedor) {
        produto.fornecedor = fornecedor;
      },

      getProduto: function() {
        return produto;
      }
    }

  });
