/**
 * Created by egmfilho on 04/11/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('Pedido', Pedido);

Pedido.$inject = [ 'Pessoa', 'ItemPedido', 'PrazoPagamento', 'Pagamento', 'Comanda', 'DataSaida' ];

function Pedido(Pessoa, ItemPedido, PrazoPagamento, Pagamento, Comanda, DataSaida) {

  function Pedido(p) {
    var self = this;

    this.id = p ? p.id : '';
    this.codigo = p ? p.codigo : '';
    this.usuarioId = p ? p.usuarioId : '';
    this.statusId = p ? p.statusId : '';
    this.clienteId = p ? p.clienteId : '';
    this.funcionarioId = p ? p.funcionarioId : '';
    this.observacoes = p ? p.observacoes : '';
    this.dataAtualizacao = p ? p.dataAtualizacao : new Date();
    this.dataPedido = p ? p.dataPedido : new Date();

    this.funcionario = p ? p.funcionario : new Pessoa();
    this.cliente = p ? p.cliente : new Pessoa();
    this.items = [];

    if (p) {
      angular.forEach(p.items, function (item, index) {
        self.items.push(new ItemPedido(item));
      });
    }

    this.prazoId = p ? p.prazoId : '';
    this.prazo = p ? p.prazo : new PrazoPagamento();
    this.pagamentos = p ? p.pagamentos : [];

    this.descontoPercent = p ? p.descontoPercent : 0;
    this.descontoDinheiro = p ? p.descontoDinheiro : 0;
    this.valor = p ? p.valor : 0;
    this.valorComDesconto = p ? p.valorComDesconto : 0;

    // this.pagamentos = [];

    // if (p) {
    //   angular.forEach(p.pagamentos, function (item, index) {
    //     self.pagamentos.push(new Pagamento(item));
    //   });
    // }

    this.comandaId = p ? p.comandaId : '';
    this.comanda = p ? p.comanda : new Comanda();
  }

  Pedido.prototype = {

    setPrazo: function(prazo) {
      this.prazoId = prazo.id;
      this.prazo = new PrazoPagamento(prazo);
    },

    setFuncionario: function(pessoa) {
      this.funcionarioId = pessoa.id;
      this.funcionario = new Pessoa(pessoa);
    },

    setCliente: function(pessoa) {
      this.clienteId = pessoa.id;
      this.cliente = new Pessoa(pessoa);
    },

    addItem: function(item) {
      this.items.push(new ItemPedido(item));
    },

    removeItem: function(item) {
      this.items.splice(this.items.indexOf(item), 1);
    },

    getValorTotal: function() {
      var total = 0;

      angular.forEach(this.items, function(item, index) {
        total += parseFloat(item.getTotalSemDesconto());
      });

      return total;
    },

    getValorTotalComDesconto: function () {
      var total = 0;

      angular.forEach(this.items, function (item, index) {
        total += item.getTotalComDesconto();
      });

      // return Math.round((total - this.descontoDinheiro) * 100) / 100;

      return total;
    },

    getPagamentoTotal: function() {
      var total = 0;
      angular.forEach(this.pagamentos, function(item, index) {
        total += item.valor;
      });

      return total;
    },

    getTroco: function() {
      return this.getPagamentoTotal() - this.getValorTotal();
    },

    trueLength: function() {
      var length = 0;

      angular.forEach(this.items, function(item, index) {
        if (!item.removido) {
          length++;
        }
      });

      return length;
    }

  };

  Pedido.converterEmEntrada = function (p) {
    var pedido = {};

    pedido.id = p.ticket_id;
    pedido.codigo = p.ticket_code;
    pedido.usuarioId = p.ticket_user_id;
    pedido.statusId = p.ticket_status_id;
    pedido.clienteId = p.ticket_client_id;
    pedido.vendedorId = p.ticket_seller_id;
    pedido.observacoes = p.ticket_note;
    pedido.descontoPercent = parseFloat(p.ticket_al_discount);
    pedido.descontoDinheiro = parseFloat(p.ticket_vl_discount);
    pedido.valor = parseFloat(p.ticket_value);
    pedido.valorComDesconto = parseFloat(p.ticket_value_total);
    pedido.dataAtualizacao = p.ticket_update ? new Date(p.ticket_update) : null;
    pedido.dataPedido = new Date(p.ticket_date);
    pedido.comandaId = p.ticket_card_id;

    if (p.ticket_card) {
      pedido.comanda = new Comanda(Comanda.converterEmEntrada(p.ticket_card));
    } else {
      pedido.comanda = new Comanda();
    }

    if (p.ticket_employee) {
      pedido.vendedor = new Pessoa(Pessoa.converterEmEntrada(p.ticket_employee));
    } else {
      pedido.vendedor = new Pessoa();
    }

    if (p.ticket_client) {
      pedido.cliente = new Pessoa(Pessoa.converterEmEntrada(p.ticket_client));
    } else {
      pedido.cliente = new Pessoa();
    }

    pedido.items = [];
    if (p.ticket_items) {
      angular.forEach(p.ticket_items, function (item, index) {
        pedido.items.push(new ItemPedido(ItemPedido.converterEmEntrada(item)));
      });
    }

    pedido.prazoId = p.ticket_payment_term_id;
    if (p.ticket_payment_term) {
      pedido.prazo = new PrazoPagamento(PrazoPagamento.converterEmEntrada(p.ticket_payment_term));
    } else {
      pedido.prazo = new PrazoPagamento();
    }

    pedido.pagamentos = [];
    if (p.ticket_payments) {
      angular.forEach(p.ticket_payments, function (item, index) {
        pedido.pagamentos.push(new Pagamento(Pagamento.converterEmEntrada(item)));
      });
    }

    return pedido;
  };

  Pedido.converterEmSaida = function (pedido) {
    var p = {};

    p.ticket_id = pedido.id;
    p.ticket_client_id = pedido.clienteId ? pedido.cliente.id : pedido.clienteId;
    p.ticket_code_bar = pedido.comanda.codigoDeBarras ? pedido.comanda.codigoDeBarras : null;
    // p.ticket_note = pedido.observacoes;
    // p.ticket_status_id = pedido.statusId;

    p.ticket_value = pedido.getValorTotal();
    // p.ticket_al_discount = pedido.descontoPercent;
    // p.ticket_vl_discount = pedido.descontoDinheiro;
    p.ticket_value_total = pedido.getValorTotalComDesconto();

    p.ticket_payment_term_id = pedido.prazoId;

    p.ticket_card_id = pedido.comandaId;

    p.ticket_items = [];
    angular.forEach(pedido.items, function (item, index) {
      p.ticket_items.push(ItemPedido.converterEmSaida(item));
    });

    p.ticket_payments = [];
    angular.forEach(pedido.pagamentos, function (item, index) {
      p.ticket_payments.push(Pagamento.converterEmSaida(item));
    });

    return p;
  };

  Pedido.converterEmSaidaPDV = function (pedido) {
    var p = {};

    p.document_id = pedido.id;
    p.document_client_id = pedido.clienteId ? pedido.cliente.id : pedido.clienteId;
    p.document_employee_id = pedido.funcionarioId;
    // p.document_note = pedido.observacoes;
    // p.document_status_id = pedido.statusId;

    p.document_items = [];
    angular.forEach(pedido.items, function (item, index) {
      p.document_items.push(ItemPedido.converterEmSaida(item));
    });

    p.document_value = pedido.getValorTotal();
    // p.document_al_discount = pedido.descontoPercent;
    // p.document_vl_discount = pedido.descontoDinheiro;
    p.document_value_total = pedido.getValorTotalComDesconto();

    p.document_payment_term_id = pedido.prazoId;
    p.document_payments = [];

    angular.forEach(pedido.pagamentos, function (item, index) {
      p.document_payments.push(Pagamento.converterEmSaida(item));
    });

    return p;
  };

  return Pedido;

}
