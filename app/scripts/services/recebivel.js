/**
 * Created by egmfilho on 23/12/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('Recebivel', Recebivel);

Recebivel.$inject = [ 'DataSaida' ];

function Recebivel(DataSaida) {

  function Recebivel(recebivel) {
    this.id = recebivel ? recebivel.id : '';
    this.usuarioId = recebivel ? recebivel.usuarioId : '';
    this.documentoId = recebivel ? recebivel.documentoId : '';
    this.pessoaId = recebivel ? recebivel.pessoaId : '';
    this.formaId = recebivel ? recebivel.formaId : '';
    this.codigo = recebivel ? recebivel.codigo : '';
    this.observacoes = recebivel ? recebivel.observacoes : '';
    this.valor = recebivel ? recebivel.valor : '';
    this.pago = recebivel ? recebivel.pago : '';
    this.excluido = recebivel ? recebivel.excluido : false;
    this.baixaNaInclusao = recebivel ? recebivel.baixaNaInclusao : true;
    this.dataExclusao = recebivel ? recebivel.dataExclusao : null;
    this.vencimento = recebivel ? recebivel.vencimento : null;
    this.dataBaixa = recebivel ? recebivel.dataBaixa : null;
    this.dataUpdate = recebivel ? recebivel.dataUpdate : null;
    this.data = recebivel ? recebivel.data : null;
  }

  Recebivel.converterEmEntrada = function(r) {
    var recebivel = { };

    recebivel.id = r.receivable_id;
    recebivel.usuarioId = r.receivable_user_id;
    recebivel.documentoId = r.receivable_document_id;
    recebivel.pessoaId = r.receivable_person_id;
    recebivel.formaId = r.receivable_payment_mode_id;
    recebivel.codigo = r.receivable_code;
    recebivel.observacoes = r.receivable_note;
    recebivel.valor = r.receivable_value;
    recebivel.pago = r.receivable_paid;
    recebivel.excluido = r.receivable_trash == 'Y';
    recebivel.baixaNaInclusao = r.receivable_drop == 'Y';
    recebivel.dataExclusao = new Date(r.receivable_date_trash);
    recebivel.vencimento = new Date(r.receivable_date_deadline);
    recebivel.dataBaixa = new Date(r.receivable_date_drop);
    recebivel.dataUpdate = new Date(r.receivable_update);
    recebivel.data = new Date(r.receivable_date);

    return recebivel;
  };

  Recebivel.converterEmSaida = function(recebivel) {
    var r = { };

    r.receivable_id = recebivel.id;
    r.receivable_user_id = recebivel.usuarioId;
    r.receivable_document_id = recebivel.documentoId;
    r.receivable_person_id = recebivel.pessoaId;
    r.receivable_payment_mode_id = recebivel.formaId;
    r.receivable_code = recebivel.codigo;
    r.receivable_code = recebivel.observacoes;
    r.receivable_value = recebivel.valor;
    r.receivable_paid = recebivel.pago;
    r.receivable_trash = recebivel.excluido ? 'Y' : 'N';
    r.receivable_drop = recebivel.baixaNaInclusao ? 'Y' : 'N';
    r.receivable_date_trash = DataSaida.converter(recebivel.dataExclusao);
    r.receivable_date_deadline = DataSaida.converter(recebivel.vencimento);
    r.receivable_date_drop = DataSaida.converter(recebivel.dataBaixa);
    r.receivable_update = DataSaida.converter(recebivel.dataUpdate);
    r.receivable_date = DataSaida.converter(recebivel.data);

    return r;
  };

  return Recebivel;

}
