/**
 * Created by egmfilho on 20/12/16.
 */

/**
 * Created by egmfilho on 04/11/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('Documento', Documento);

Documento.$inject = [ 'Pessoa', 'ItemPedido', 'PrazoPagamento', 'Pagamento', 'DataSaida' ];

function Documento(Pessoa, ItemPedido, PrazoPagamento, Pagamento, DataSaida) {

  function Documento(p) {
    var self = this;

    this.id = p ? p.id : '';
    this.codigo = p ? p.codigo : '';
    this.usuarioId = p ? p.usuarioId : '';
    this.statusId = p ? p.statusId : '';
    this.clienteId = p ? p.clienteId : '';
    this.funcionarioId = p ? p.funcionarioId : '';
    this.observacoes = p ? p.observacoes : '';
    this.dataAtualizacao = p ? p.dataAtualizacao : new Date();
    this.dataDocumento = p ? p.dataDocumento : new Date();

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
  }

  Documento.prototype = {

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

      return Math.round((total - this.descontoDinheiro) * 100) / 100;
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

  Documento.converterEmEntrada = function (p) {
    var documento = {};

    documento.id = p.document_id;
    documento.codigo = p.document_code;
    documento.usuarioId = p.document_user_id;
    documento.statusId = p.document_status_id;
    documento.clienteId = p.document_client_id;
    documento.vendedorId = p.document_seller_id;
    documento.observacoes = p.document_note;
    documento.descontoPercent = parseFloat(p.document_al_discount);
    documento.descontoDinheiro = parseFloat(p.document_vl_discount);
    documento.valor = parseFloat(p.document_value);
    documento.valorComDesconto = parseFloat(p.document_value_total);
    documento.dataAtualizacao = new Date(p.document_update);
    documento.dataDocumento = new Date(p.document_date);

    if (p.document_employee) {
      documento.vendedor = new Pessoa(Pessoa.converterEmEntrada(p.document_employee));
    } else {
      documento.vendedor = new Pessoa();
    }

    if (p.document_client) {
      documento.cliente = new Pessoa(Pessoa.converterEmEntrada(p.document_client));
    } else {
      documento.cliente = new Pessoa();
    }

    documento.items = [];
    if (p.document_items) {
      angular.forEach(p.document_items, function (item, index) {
        documento.items.push(new ItemPedido(ItemPedido.converterEmEntrada(item)));
      });
    }

    documento.prazoId = p.document_payment_term_id;
    if (p.document_payment_term) {
      documento.prazo = new PrazoPagamento(PrazoPagamento.converterEmEntrada(p.document_payment_term));
    } else {
      documento.prazo = new PrazoPagamento();
    }

    documento.pagamentos = [];
    if (p.document_payments) {
      angular.forEach(p.document_payments, function (item, index) {
        documento.pagamentos.push(new Pagamento(Pagamento.converterEmEntrada(item)));
      });
    }

    return documento;
  };

  Documento.importarTicket = function (p) {
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
    pedido.dataAtualizacao = new Date(p.ticket_update);
    pedido.dataDocumento = new Date(p.ticket_date);

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

  Documento.converterEmSaida = function (documento) {
    var p = {};

    p.document_id = documento.id;
    p.document_client_id = documento.clienteId ? documento.cliente.id : documento.clienteId;
    p.document_employee_id = documento.funcionarioId;
    // p.document_note = documento.observacoes;
    // p.document_status_id = documento.statusId;

    p.document_items = [];
    angular.forEach(documento.items, function (item, index) {
      p.document_items.push(ItemPedido.converterEmSaida(item));
    });

    p.document_value = documento.getValorTotal();
    // p.document_al_discount = documento.descontoPercent;
    // p.document_vl_discount = documento.descontoDinheiro;
    p.document_value_total = documento.getValorTotalComDesconto();

    p.document_payment_term_id = documento.prazoId;
    p.document_payments = [];

    angular.forEach(documento.pagamentos, function (item, index) {
      p.document_payments.push(Pagamento.converterEmSaida(item));
    });

    return p;
  };

  return Documento;

}
