/**
 * Created by egmfilho on 19/07/16.
 */
'use strict';

angular.module('belissimaApp')
  .factory('Produto', [
    'DataSaida',
    'Fornecedor',
    'PrecoProduto',
    'CustoProduto',
    'GrupoProduto',
    function(data, Fornecedor, PrecoProduto, CustoProduto, GrupoProduto) {

      function Produto(produto) {
        this.id = produto ? produto.id : '';
        this.tipoId = produto ? produto.tipoId : '';
        this.fornecedorId = produto ? produto.fornecedorId : '';
        this.fornecedor = produto ? produto.fornecedor : '';
        this.unidadeId = produto ? produto.unidadeId : '';
        this.grupoId = produto ? produto.grupoId : '';
        this.grupo = produto ? produto.grupo : '';
        this.ativo = produto ? produto.ativo : '';
        this.codigo = produto ? produto.codigo : '';
        this.codBarras = produto ? produto.codBarras : '';
        this.nome = produto ? produto.nome : '';
        this.descricao = produto ? produto.descricao : '';
        this.dataCadastro = produto ? produto.dataCadastro : '';
        this.preco = produto ? produto.preco : '';
        this.custo = produto ? produto.custo : '';
        this.comissao = produto ? produto.comissao : '';
      }

      Produto.prototype = {
        setPreco: function(precoProduto) {
          this.preco = precoProduto;
        },

        setCusto: function(custoProduto) {
          this.custo = custoProduto;
        },

        setFornecedor: function(fornecedor) {
          this.fornecedor = fornecedor;
          this.fornecedorId = this.fornecedor.id;
        },

        removeFornecedor: function() {
          this.fornecedor = new Fornecedor();
          this.fornecedorId = null;
        },

        setGrupo: function(grupo) {
          this.grupo = grupo;
          this.grupoId = this.grupo.id;
        }
      };

      Produto.converterEmEntrada = function(product) {
        var produto = { };

        produto.id = product.product_id;
        produto.tipoId = product.product_type_id;
        produto.fornecedorId = product.provider_id;

        if (product.provider) {
          //produto.fornecedor = new Fornecedor(Fornecedor.converterEmEntrada(product.provider));
        } else {
          produto.fornecedor = new Fornecedor();
        }

        produto.unidadeId = product.product_unit_id;
        produto.grupoId = product.product_group_id;

        if (product.product_group) {
          produto.grupo = new GrupoProduto(GrupoProduto.converterEmEntrada(product.product_group));
        } else {
          produto.grupo = new GrupoProduto();
        }

        produto.ativo = product.product_active;
        produto.codigo = product.product_code;
        produto.codBarras = product.product_ean;
        produto.nome = product.product_name;
        produto.descricao = product.product_description;
        produto.comissao = product.product_commission;
        produto.dataCadastro = product.product_date;

        if (product.product_price) {
          produto.preco = new PrecoProduto(PrecoProduto.converterEmEntrada(product.product_price));
        } else {
          produto.preco = new PrecoProduto();
        }

        if (product.product_cost) {
          produto.custo = new CustoProduto(CustoProduto.converterEmEntrada(product.product_cost));
        } else {
          produto.custo = new CustoProduto();
        }

        return produto;
      };

      return Produto;

  }]);
