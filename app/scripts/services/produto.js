/**
 * Created by egmfilho on 19/07/16.
 */
'use strict';

angular.module('belissimaApp')
  .factory('Produto', [
    'DataSaida',
    'PrecoProduto',
    'CustoProduto',
    'GrupoProduto',
    function(data, PrecoProduto, CustoProduto, GrupoProduto) {

      function Produto(produto) {
        this.id = produto.id;
        this.tipoId = produto.tipoId;
        this.fornecedorId = produto.fornecedorId;
        this.fornecedor = produto.fornecedor;
        this.unidadeId = produto.unidadeId;
        this.grupoId = produto.grupoId;
        this.grupo = produto.grupo;
        this.ativo = produto.ativo;
        this.codigo = produto.codigo;
        this.codBarras = produto.codBarras;
        this.nome = produto.nome;
        this.descricao = produto.descricao;
        this.dataCadastro = produto.dataCadastro;
        this.preco = produto.preco;
        this.custo = produto.custo;
        this.comissao = produto.comissao;
      }

      Produto.prototype = {
        setComissao: function(comissao) {
          this.comissao = comissao;
        },

        setPreco: function(precoProduto) {
          this.preco = precoProduto;
        },

        setCusto: function(custoProduto) {
          this.custo = custoProduto;
        },

        setFornecedor: function(fornecedor) {
          this.fornecedor = fornecedor;
          this.fornecedorId = this.fornecedor.id;
        }
      };

      Produto.converterEmEntrada = function(product) {
        var produto = { };

        produto.id = product.product_id;
        produto.tipoId = product.product_type_id;
        produto.fornecedorId = product.provider_id;

        if (product.provider) {
          //produto.fornecedor =
        } else {
          produto.fornecedor = { };
        }

        produto.unidadeId = product.product_unit_id;
        produto.grupoId = product.product_group_id;

        if (product.product_group) {
          produto.grupo = new GrupoProduto(GrupoProduto.converterEmEntrada(product.product_group));
        } else {
          produto.grupo = { };
        }

        produto.ativo = product.product_active;
        produto.codigo = product.product_code;
        produto.codBarras = product.product_ean;
        produto.nome = product.product_name;
        produto.drescricao = product.product_description;
        produto.comissao = product.product_commission;
        produto.dataCadastro = product.product_date;

        if (product.product_price) {
          produto.preco = new PrecoProduto(PrecoProduto.converterEmEntrada(product.product_price));
        } else {
          produto.preco = { };
        }

        if (product.product_cost) {
          produto.custo = new CustoProduto(CustoProduto.converterEmEntrada(product.product_cost));
        } else {
          produto.custo = { };
        }

        return produto;
      };

      return Produto;

  }]);
