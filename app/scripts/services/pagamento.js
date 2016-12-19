/**
 * Created by egmfilho on 22/11/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('Pagamento', Pagamento);

Pagamento.$inject = [ 'FormaPagamento', 'DataSaida' ];

function Pagamento(FormaPagamento, DataSaida) {

  function Pagamento(pagamento) {
    this.formaId = pagamento ? pagamento.formaId : '';
    this.forma = pagamento ? pagamento.forma : new FormaPagamento();
    this.vencimento = pagamento ? pagamento.vencimento : new Date();
    this.valor = pagamento ? pagamento.valor : 0;

    this.descontoPercent = pagamento ? pagamento.descontoPercent : 0;
    this.descontoDinheiro = pagamento ? pagamento.descontoDinheiro : 0;
  }

  Pagamento.prototype = {
    setForma: function(forma) {
      if (forma) {
        this.forma = new FormaPagamento(forma);
      }
      this.formaId = this.forma.id;
    },

    getValorTotalComDesconto: function() {
      return this.valor;
    }
  };

  Pagamento.converterEmEntrada = function(payment) {
    var pagamento = { };

    pagamento.formaId = payment.payment_mode_id;
    pagamento.forma = new FormaPagamento(FormaPagamento.converterEmEntrada(payment.payment_mode));
    pagamento.vencimento = new Date(payment.ticket_payment_deadline);
    pagamento.valor = parseFloat(payment.ticket_payment_value);

    pagamento.descontoPercent = parseFloat(payment.ticket_payment_al_discount);
    pagamento.descontoDinheiro = parseFloat(payment.ticket_payment_vl_discount);

    return pagamento;
  };

  Pagamento.converterEmSaida = function(pagamento) {
    var payment = { };

    payment.ticket_payment_mode_id = pagamento.formaId;
    payment.ticket_payment_deadline = DataSaida.converter(pagamento.vencimento);
    payment.ticket_payment_value = pagamento.valor;

    payment.ticket_payment_al_discount = pagamento.descontoPercent;
    payment.ticket_payment_vl_discount = pagamento.descontoDinheiro;
    payment.ticket_payment_value_total = pagamento.getValorTotalComDesconto();

    return payment;
  };

  return Pagamento;
}
