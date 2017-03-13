/**
 * Created by egmfilho on 21/12/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('Movimentacao', Movimentacao);

Movimentacao.$inject = [ 'Produto' ];

function Movimentacao(Produto) {

  function Movimentacao(movimentacao) {
    this.id = movimentacao ? movimentacao.id : '';
    this.usuarioId = movimentacao ? movimentacao.usuarioId : '';
    this.documentoId = movimentacao ? movimentacao.documentoId : '';
    this.produtoId = movimentacao ? movimentacao.produtoId : '';
    this.produto = movimentacao ? new Produto(movimentacao.produto) : new Produto();
    this.cancelado = movimentacao ? movimentacao.cancelado : false;
    this.data = movimentacao ? movimentacao.data : new Date();
    this.dataCancelamento = movimentacao ? movimentacao.dataCancelamento : null;
    this.dataReferencia = movimentacao ? movimentacao.dataReferencia : new Date();
    this.tipo = movimentacao ? movimentacao.tipo : 'E';
    this.valor = movimentacao ? movimentacao.valor : 1;
  }

  Movimentacao.prototype = {

    setProduto: function(produto) {
      this.produto = new Produto(produto);
      this.produtoId = this.produto.id;
    }

  };

  Movimentacao.converterEmEntrada = function(movement) {
    var movimentacao = { };

    movimentacao.id = movement.product_movement_value;
    movimentacao.usuarioId = movement.user_id;
    movimentacao.documentoId = movement.document_id;
    movimentacao.produtoId = movement.product_id;
    movimentacao.produto = movement.product ? new Produto(Produto.converterEmEntrada(movement.product)) : new Produto();
    movimentacao.cancelado = movement.product_movement_canceled === 'Y';
    movimentacao.data = new Date(movement.product_movement_date);
    movimentacao.dataCancelamento = new Date(movement.product_movement_date_canceled);
    movimentacao.dataReferencia = new Date(movement.product_movement_date_reference.replace(/-/g, '/').split('T')[0]);
    movimentacao.tipo = movement.product_movement_type;
    movimentacao.valor = movement.product_movement_value;

    return movimentacao;
  };

  Movimentacao.converterEmSaida = function(movimentacao) {
    var movement = { };

    movement.product_movement_value = movimentacao.id;
    movement.user_id = movimentacao.usuarioId;
    movement.document_id = movimentacao.documentoId;
    movement.product_id = movimentacao.produtoId;
    movement.product_movement_canceled = movimentacao.cancelado ? 'Y' : 'N';
    movement.product_movement_date = movimentacao.data;
    movement.product_movement_date_canceled = movimentacao.dataCancelamento;
    movement.product_movement_date_reference = movimentacao.dataReferencia;
    movement.product_movement_type = movimentacao.tipo;
    movement.product_movement_value = movimentacao.valor;

    return movement;
  };

  return Movimentacao;

}
