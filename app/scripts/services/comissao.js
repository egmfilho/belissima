/**
 * Created by egmfilho on 23/12/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('Comissao', Comissao);

Comissao.$inject = [ 'Recebivel', 'ItemDocumento', 'DataSaida' ];

function Comissao(Recebivel, ItemDocumento, DataSaida) {

  function Comissao(comissao) {
    this.id = comissao ? comissao.id : '';
    this.usuarioId = comissao ? comissao.usuarioId : '';
    this.funcionarioId = comissao ? comissao.funcionarioId : '';
    this.recebivelId = comissao ? comissao.recebivelId : '';
    this.recebivel = comissao ? comissao.recebivel : new Recebivel();
    this.itemId = comissao ? comissao.itemId : '';
    this.item = comissao ? comissao.item : new ItemDocumento();
    this.observacao = comissao ? comissao.observacao : '';
    this.aliquota = comissao ? comissao.aliquota : '';
    this.valorBase = comissao ? comissao.valorBase : '';
    this.valorTotal = comissao ? comissao.valorTotal : '';
    this.status = comissao ? comissao.status : '';
    this.dataStatus = comissao ? comissao.dataStatus : null;
    this.vencimento = comissao ? comissao.vencimento : null;
    this.data = comissao ? comissao.data : null;
  }

  Comissao.prototype = {

    getStatus: function() {
      switch (this.status) {
        case 'A':
          return 'Aberto';
        break;

        case 'L':
          return 'Liberado';
        break;

        case 'F':
          return 'Fechado';
        break;

        case 'C':
          return 'Cancelado';
        break;

        default:
          return 'Indisponível';
        break;
      }
    }

  };

  Comissao.converterEmEntrada = function(c) {
    var comissao = { };

    comissao.id = c.comission_id;
    comissao.usuarioId = c.comission_user_id;
    comissao.funcionarioId = c.comission_employee_id;
    comissao.recebivelId = c.comission_receivable_id;
    comissao.recebivel = c.comission_receivable ? new Recebivel(Recebivel.converterEmEntrada(c.comission_receivable)) : new Recebivel();
    comissao.itemId = c.comission_document_item_id;
    comissao.item = c.comission_document_item ? new ItemDocumento(ItemDocumento.converterEmEntrada(c.comission_document_item)) : new ItemDocumento();
    comissao.observacao = c.comission_note;
    comissao.aliquota = c.comission_aliquot;
    comissao.valorBase = c.comission_value_base;
    comissao.valorTotal = c.comission_value_total;
    comissao.status = c.comission_status; // status: A(aberto), L(liberado), F(fechado), C(cancelado)
    comissao.dataStatus = c.comission_status_date ? new Date(c.comission_status_date) : null;
    comissao.vencimento = new Date(c.comission_deadline);
    comissao.data = new Date(c.comission_date);

    return comissao;
  };

  Comissao.converterEmSaida = function(comissao) {
    var c = { };

    c.comission_id = comissao.id;
    c.comission_user_id = comissao.usuarioId;
    c.comission_employee_id = comissao.funcionarioId;
    c.comission_receivable_id = comissao.recebivel;
    c.comission_document_item_id = comissao.itemId;
    c.comission_note = comissao.observacao;
    c.comission_aliquot = comissao.aliquota;
    c.comission_value_base = comissao.valorBase;
    c.comission_value_total = comissao.valorTotal;
    c.comission_status = comissao.status;
    c.comission_status_date = DataSaida.converter(comissao.dataStatus);
    c.comission_deadline = DataSaida.converter(comissao.vencimento);
    c.comission_date = DataSaida.converter(comissao.data);

    return c;
  };

  return Comissao;

}
