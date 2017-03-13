/**
 * Created by egmfilho on 22/12/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('ItemDocumento', ItemDocumento);

ItemDocumento.$inject = [ 'Produto', 'Pessoa', 'TabelaDesconto' ];

function ItemDocumento(Produto, Pessoa, TabelaDesconto) {

  function ItemDocumento(itemDocumento) {
    this.id = itemDocumento ? itemDocumento.id : '';
    this.pedidoId = itemDocumento ? itemDocumento.pedidoId : '';
    this.produtoId = itemDocumento ? itemDocumento.produtoId : '';
    this.precoProduto = itemDocumento ? itemDocumento.precoProduto : '';
    this.descontoPercent = itemDocumento ? itemDocumento.descontoPercent : 0;
    this.descontoDinheiro = itemDocumento ? itemDocumento.descontoDinheiro : 0;
    this.quantidade = itemDocumento ? itemDocumento.quantidade : 1;
    this.produto = itemDocumento ? new Produto(itemDocumento.produto) : new Produto();
    this.funcionarioId = itemDocumento ? itemDocumento.funcionarioId : '';
    this.funcionario = itemDocumento ? new Pessoa(itemDocumento.funcionario) : new Pessoa();

    // auxiliares para exibição na tela de pdv.
    this.index = itemDocumento ? itemDocumento.index : null;
    this.removido = itemDocumento ? itemDocumento.removido : null;

    this.tabelaDescontoId = itemDocumento ? itemDocumento.tabelaDescontoId : null;
    this.tabelaDesconto = itemDocumento ? itemDocumento.tabelaDesconto : null;
  }

  ItemDocumento.prototype = {

    setProduto: function(produto) {
      this.produto = new Produto(produto);
      this.produtoId = produto.id;
      this.precoProduto = produto.preco.valor;
    },

    setQuantidade: function(quantidade) {
      if (quantidade) {
        this.quantidade = Math.max(quantidade, 0);
      }
      this.setDescontoPercent(this.descontoPercent);
    },

    setDescontoPercent: function(percent) {
      if (percent) {
        this.descontoPercent = parseFloat(percent);
      }
      this.descontoPercent = Math.min(parseFloat(this.descontoPercent), parseFloat(this.produto.comissao));

      this.descontoDinheiro = parseFloat(this.descontoPercent) > 0 ? this.getTotalSemDesconto() * (parseFloat(this.descontoPercent) / 100) : 0;
    },

    setDescontoDinheiro: function(dinheiro) {
      if (dinheiro) {
        this.descontoDinheiro = parseFloat(dinheiro);
      }
      this.descontoDinheiro = Math.min(parseFloat(this.descontoDinheiro), parseFloat(this.produto.preco.valor) * parseFloat(this.produto.comissao / 100));

      this.descontoPercent = (parseFloat(this.descontoDinheiro) * 100) / this.getTotalSemDesconto();
    },

    setFuncionario: function(funcionario) {
      this.funcionarioId = funcionario.id;
      this.funcionario = new Pessoa(funcionario);
    },

    setTabelaDesconto: function(tabelaDesconto) {

      if (tabelaDesconto) {
        this.tabelaDesconto = new TabelaDesconto(tabelaDesconto);
      }

      this.tabelaDescontoId = this.tabelaDesconto.id;
    },

    getTotalSemDesconto: function() {
      if (this.hasOwnProperty('removido')) {
        if (this.removido) {
          return 0;
        }
      }

      return this.quantidade * this.precoProduto;
    },

    getTotalComDesconto: function() {
      if (this.hasOwnProperty('removido')) {
        if (this.removido) {
          return 0;
        }
      }

      return (this.quantidade * this.precoProduto) - this.descontoDinheiro;
    }
  };

  ItemDocumento.converterEmEntrada = function(i) {
    var item = { };

    item.id = i.document_item_id;
    item.pedidoId = i.ticket_id;
    item.produtoId = i.product_id;
    item.funcionarioId = i.employee_id;
    item.quantidade = parseFloat(i.ticket_item_amount);
    item.precoProduto = parseFloat(i.ticket_item_value);
    item.descontoPercent = parseFloat(i.ticket_item_al_discount);
    item.descontoDinheiro = parseFloat(i.ticket_item_vl_discount);
    item.tabelaDescontoId = i.discount_table_id ? i.discount_table_id : null;

    if (i.discount_table) {
      item.tabelaDesconto = new TabelaDesconto(TabelaDesconto.converterEmEntrada(i.discount_table));
    } else {
      item.tabelaDesconto = new TabelaDesconto();
    }

    if (i.product) {
      item.produto = new Produto(Produto.converterEmEntrada(i.product));
    } else {
      item.produto = new Produto();
    }

    if (i.employee) {
      item.funcionario = new Pessoa(Pessoa.converterEmEntrada(i.employee));
    } else {
      item.funcionario = new Pessoa();
    }

    return item;
  };

  ItemDocumento.converterEmSaida = function(item) {
    var i = { };

    i.document_id = item.documentoId;
    i.ticket_id = item.ticketId;
    i.document_item_value = item.precoProduto;
    i.document_item_al_discount = item.descontoPercent;
    i.document_item_vl_discount = item.descontoDinheiro;
    i.document_item_amount = item.quantidade;
    i.document_item_value_total = item.getTotalComDesconto();
    i.product_id = item.produtoId || item.produto.id;
    i.document_item_employee_id = item.funcionarioId;
    i.document_item_removed = item.removido ? 'Y' : 'N';
    i.discount_table_id = item.tabelaDescontoId;

    return i;
  };

  return ItemDocumento;

}
