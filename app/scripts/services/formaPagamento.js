/**
 * Created by egmfilho on 09/11/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('FormaPagamento', FormaPagamento);

function FormaPagamento() {

  function FormaPagamento(forma) {
    this.id = forma ? forma.id : '';
    this.codigo = forma ? forma.codigo : '';
    this.descricao = forma ? forma.descricao : '';
    this.ativo = forma ? forma.ativo : true;
    this.dataCadastro = forma ? forma.dataCadastro : '';
    this.dataUpdate = forma ? forma.dataUpdate : '';
  }

  FormaPagamento.converterEmEntrada = function(mode) {
    var forma = { };

    forma.id = mode.payment_mode_id;
    forma.codigo = mode.payment_mode_code;
    forma.descricao = mode.payment_mode_description;
    forma.ativo = mode.payment_mode_active === 'Y';
    forma.dataCadastro = new Date(mode.payment_mode_date);
    forma.dataUpdate = mode.payment_mode_update ? new Date(mode.payment_mode_update) : null;

    return forma;
  };

  FormaPagamento.converterEmSaida = function(forma) {
    var mode = { };

    mode.payment_mode_id = forma.id;
    mode.payment_mode_code = forma.codigo;
    mode.payment_mode_description = forma.descricao;
    mode.payment_mode_active = forma.ativo ? 'Y' : 'N';

    return mode;
  };

  return FormaPagamento;
}
