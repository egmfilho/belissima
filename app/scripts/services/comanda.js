/**
 * Created by egmfilho on 21/12/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('Comanda', Comanda);

function Comanda() {

  function Comanda(comanda) {
    this.id = comanda ? comanda.id : '';
    this.codigo = comanda ? comanda.codigo : '';
    this.codigoDeBarras = comanda ? comanda.codigoDeBarras : '';
    this.dataCadastro = comanda ? comanda.dataCadastro : null;
    this.dataUpdate = comanda ? comanda.dataUpdate : null;
  }

  Comanda.converterEmEntrada = function (card) {
    var comanda = { };

    comanda.id = card.card_id;
    comanda.codigo = card.card_code;
    comanda.codigoDeBarras = card.card_code_bar;
    comanda.dataCadastro = new Date(card.card_date);
    comanda.dataUpdate = card.card_update ? new Date(card.card_update) : null;

    return comanda;
  };

  Comanda.converterEmSaida = function (comanda) {
    var card = { };

    card.card_id = comanda.id;
    card.card_code = comanda.codigo;
    card.card_code_bar = comanda.codigoDeBarras;

    return card;
  };

  return Comanda;

}
