/**
 * Created by egmfilho on 22/12/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('ItemDocumento', ItemDocumento);

ItemDocumento.$inject = [ 'Produto', 'Pessoa' ];

function ItemDocumento(Produto, Pessoa) {

  function ItemDocumento(itemPedido) {
    this.id = itemPedido ? itemPedido.id : '';
    this.pedidoId = itemPedido ? itemPedido.pedidoId : '';
    this.produtoId = itemPedido ? itemPedido.produtoId : '';
    this.precoProduto = itemPedido ? itemPedido.precoProduto : '';
    this.descontoPercent = itemPedido ? itemPedido.descontoPercent : 0;
    this.descontoDinheiro = itemPedido ? itemPedido.descontoDinheiro : 0;
    this.quantidade = itemPedido ? itemPedido.quantidade : 1;
    this.produto = itemPedido ? new Produto(itemPedido.produto) : new Produto();
    this.funcionarioId = itemPedido ? itemPedido.funcionarioId : '';
    this.funcionario = itemPedido ? new Pessoa(itemPedido.funcionario) : new Pessoa();

    // auxiliares para exibição na tela de pdv.
    this.index = itemPedido ? itemPedido.index : null;
    this.removido = itemPedido ? itemPedido.removido : null;
  }

  ItemDocumento.prototype = {

    setProduto: function(produto) {
      this.produto = new Produto(produto);
      this.produtoId = produto.id;
      this.precoProduto = produto.preco.valor;
    },

    setQuantidade: function(quantidade) {
      if (quantidade <= 0) {
        return;
      }

      this.quantidade = quantidade;
      this.setDescontoPercent(this.descontoPercent);
    },

    setDescontoPercent: function(percent) {
      if (percent) {
        this.descontoPercent = parseFloat(percent);
      }

      this.descontoDinheiro = parseFloat(this.descontoPercent) > 0 ? this.getTotalSemDesconto() * (parseFloat(this.descontoPercent) / 100) : 0;
    },

    setDescontoDinheiro: function(dinheiro) {
      if (dinheiro) {
        this.descontoDinheiro = parseFloat(dinheiro);
      }

      this.descontoPercent = (parseFloat(this.descontoDinheiro) * 100) / this.getTotalSemDesconto();
    },

    setFuncionario: function(funcionario) {
      this.funcionarioId = funcionario.id;
      this.funcionario = new Pessoa(funcionario);
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
    item.pedidoId = i.document_id;
    item.produtoId = i.product_id;
    item.funcionarioId = i.employee_id;
    item.quantidade = parseFloat(i.document_item_amount ? i.document_item_amount : i.ticket_item_amount);
    item.precoProduto = parseFloat(i.document_item_value ? i.document_item_value : i.ticket_item_value);
    item.descontoPercent = parseFloat(i.document_item_al_discount ? i.document_item_al_discount : i.ticket_item_al_discount);
    item.descontoDinheiro = parseFloat(i.document_item_vl_discount ? i.document_item_vl_discount : i.ticket_item_vl_discount);

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

    i.document_item_value = item.precoProduto;
    // i.document_item_al_discount = item.descontoPercent;
    // i.document_item_vl_discount = item.descontoDinheiro;
    i.document_item_amount = item.quantidade;
    i.document_item_value_total = item.getTotalComDesconto();
    i.product_id = item.produtoId || item.produto.id;
    i.document_item_employee_id = item.funcionarioId;
    i.document_item_removed = item.removido ? 'Y' : 'N';

    return i;
  };

  return ItemDocumento;

}
