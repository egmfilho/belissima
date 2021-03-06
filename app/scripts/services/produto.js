/**
 * Created by egmfilho on 19/07/16.
 */
'use strict';

angular.module('belissimaApp.services')
  .factory('Produto', [
    'DataSaida',
    'Pessoa',
    'PrecoProduto',
    'CustoProduto',
    'GrupoProduto',
    'Unidade',
    function(data, Pessoa, PrecoProduto, CustoProduto, GrupoProduto, Unidade) {

      function Produto(produto) {
        this.id = produto ? produto.id : '';
        this.tipoId = produto ? produto.tipoId : '';
        this.fornecedorId = produto ? produto.fornecedorId : '';
        this.fornecedor = produto ? produto.fornecedor : '';
        this.unidadeId = produto ? produto.unidadeId : '';
        this.unidade = produto ? produto.unidade : new Unidade();
        this.grupoId = produto ? produto.grupoId : '';
        this.grupo = produto ? produto.grupo : '';
        this.ativo = produto ? produto.ativo : true;
        this.codigo = produto ? produto.codigo : '';
        this.codBarras = produto ? produto.codBarras : '';
        this.nome = produto ? produto.nome : '';
        this.descricao = produto ? produto.descricao : '';
        this.dataCadastro = produto ? produto.dataCadastro : '';
        this.preco = produto ? new PrecoProduto(produto.preco) : new PrecoProduto();
        this.custo = produto ? new CustoProduto(produto.custo) : new CustoProduto();
        this.comissao = produto ? produto.comissao : '';
      }

      Produto.prototype = {
        setPreco: function(precoProduto) {
          this.preco = precoProduto;
        },

        setCusto: function(custoProduto) {
          this.custo = custoProduto;
        },

        setUnidade: function (unidade) {
          this.unidadeId = unidade.id;
          this.unidade = new Unidade(unidade);
        },

        setFornecedor: function(fornecedor) {
          this.fornecedor = fornecedor;
          this.fornecedorId = this.fornecedor.id;
        },

        removeFornecedor: function() {
          this.fornecedor = new Pessoa();
          this.fornecedorId = null;
        },

        setGrupo: function(grupo) {
          console.log(grupo);
          this.grupo = grupo;
          this.grupoId = this.grupo.id;
        }
      };

      Produto.converterEmEntrada = function(product) {
        var produto = { };

        produto.id = product.product_id;
        produto.tipoId = product.product_type_id;
        produto.fornecedorId = product.product_provider_id;

        if (product.provider) {
          produto.fornecedor = new Pessoa(Pessoa.converterEmEntrada(product.provider));
        } else {
          produto.fornecedor = new Pessoa();
        }

        produto.unidadeId = product.product_unit_id;
        if (product.product_unit) {
          produto.unidade = new Unidade(Unidade.converterEmEntrada(product.product_unit));
        } else {
          produto.unidade = new Unidade();
        }

        produto.grupoId = product.product_group_id;

        if (product.product_group) {
          produto.grupo = new GrupoProduto(GrupoProduto.converterEmEntrada(product.product_group));
        } else {
          produto.grupo = new GrupoProduto();
        }

        produto.ativo = product.product_active == 'Y' ? true : false;
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

      Produto.converterEmSaida = function(produto) {
        var product = { };

        product.product_id = produto.id;
        product.product_type_id = produto.tipoId;
        product.provider_id = produto.fornecedorId;
        product.product_provider_id = produto.fornecedorId;
        product.product_unit_id = produto.unidadeId;
        product.product_group_id = produto.grupoId;
        product.product_group = GrupoProduto.converterEmSaida(produto.grupo);
        product.product_active = produto.ativo ? 'Y' : 'N';
        product.product_code = produto.codigo;
        product.product_ean = produto.codBarras;
        product.product_name = produto.nome;
        product.product_description = produto.descricao;
        product.product_commission = produto.comissao;
        product.product_price = PrecoProduto.converterEmSaida(produto.preco);
        product.product_cost = CustoProduto.converterEmSaida(produto.custo);

        return product;
      };

      return Produto;

  }]);
