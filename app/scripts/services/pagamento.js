/**
 * Created by egmfilho on 22/11/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('Pagamento', Pagamento);

Pagamento.$inject = [ 'FormaPagamento', 'DataSaida' ];

function Pagamento(FormaPagamento, DataSaida) {

  function Pagamento(pagamento) {
    this.forma = pagamento ? pagamento.forma : new FormaPagamento();
    this.vencimento = pagamento ? pagamento.vencimento : new Date();
    this.valor = pagamento ? pagamento.valor : 0;
  }

  Pagamento.converterEmEntrada = function(payment) {
    var pagamento = { };

    pagamento.forma = new FormaPagamento(FormaPagamento.converterEmEntrada(payment.ticket_payment_mode));
    pagamento.vencimento = new Date(payment.ticket_payment_deadline);
    pagamento.valor = payment.ticket_payment_value;

    return pagamento;
  };

  Pagamento.converterEmSaida = function(pagamento) {
    var payment = { };

    payment.ticket_payment_mode_id = pagamento.forma.id;
    payment.ticket_payment_deadline = DataSaida.converter(pagamento.vencimento);
    payment.ticket_payment_value = pagamento.valor;

    return payment;
  };

  return Pagamento;
}
