/**
 * Created by egmfilho on 04/11/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('ItemPedido', ItemPedido);

ItemPedido.$inject = [ 'Produto', 'Pessoa' ];

function ItemPedido(Produto, Pessoa) {

  function ItemPedido(itemPedido) {
    this.id = itemPedido ? itemPedido.id : '';
    this.pedidoId = itemPedido ? itemPedido.pedidoId : '';
    this.produtoId = itemPedido ? itemPedido.produtoId : '';
    this.precoProduto = itemPedido ? itemPedido.precoProduto : '';
    this.descontoPercent = itemPedido ? itemPedido.descontoPercent : 0;
    this.descontoDinheiro = itemPedido ? itemPedido.descontoDinheiro : 0;
    this.quantidade = itemPedido ? itemPedido.quantidade : 1;
    this.produto = itemPedido ? new Produto(itemPedido.produto) : new Produto();
  }

  ItemPedido.prototype = {

    setProduto: function(produto) {
      this.produto = new Produto(Produto.converterEmEntrada(produto));
      this.produtoId = produto.id;
      this.precoProduto = produto.preco;
    },

    setQuantidade: function(quantidade) {
      if (quantidade <= 0) {
        return;
      }

      this.quantidade = quantidade;
      this.setDescontoPercent(this.descontoPercent);
    },

    setDescontoPercent: function(percent) {
      this.descontoPercent = parseFloat(percent);
      this.descontoDinheiro = parseFloat(percent) > 0 ? this.getTotalSemDesconto() * (parseFloat(percent) / 100) : 0;
    },

    setDescontoDinheiro: function(dinheiro) {
      this.descontoDinheiro = parseFloat(dinheiro);
      this.descontoPercent = (parseFloat(dinheiro) * 100) / this.getTotalSemDesconto();
    },

    getTotalSemDesconto: function() {
      return this.quantidade * this.produto.preco;
    },

    getTotalComDesconto: function() {
      return (this.quantidade * this.produto.preco) - this.descontoDinheiro;
    }
  };

  ItemPedido.converterEmEntrada = function(i) {
    var item = { };

    item.id = i.ticket_item_id;
    item.pedidoId = i.ticket_id;
    item.produtoId = i.product_id;
    item.quantidade = parseFloat(i.ticket_item_amount);
    item.precoProduto = parseFloat(i.ticket_item_value);
    item.descontoPercent = parseFloat(i.ticket_item_al_discount);
    item.descontoDinheiro = parseFloat(i.ticket_item_vl_discount);

    if (i.product) {
      item.produto = new Produto(Produto.converterEmEntrada(i.product));
    } else {
      item.produto = new Produto();
    }

    return item;
  };

  ItemPedido.converterEmSaida = function(item) {
    var i = { };

    i.ticket_item_value = item.precoProduto || item.produto.preco;
    i.ticket_item_al_discount = item.descontoPercent;
    i.ticket_item_vl_discount = item.descontoDinheiro;
    i.ticket_item_amount = item.quantidade;
    i.ticket_item_value_total = item.getTotalComDesconto();
    i.product_id = item.produtoId || item.produto.id;

    return i;
  };

  return ItemPedido;

}
