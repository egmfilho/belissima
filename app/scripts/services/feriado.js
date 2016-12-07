/**
 * Created by egmfilho on 07/12/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('Feriado', Feriado);

function Feriado() {

  function Feriado(feriado) {
    this.data = feriado ? feriado.data : null;
    this.titulo = feriado ? feriado.titulo : '';
    this.descricao = feriado ? feriado.descricao : '';
    this.legislacao = feriado ? feriado.legislacao : '';
    this.variavel = feriado ? feriado.variavel : [ ];
  }

  Feriado.converterEmEntrada = function(f) {
    var feriado = { };

    feriado.data = f.date ? new Date('1901/' + f.date.split('/')[1] + '/' + f.date.split('/')[0]) : null;
    feriado.titulo = f.title;
    feriado.descricao = f.description;
    feriado.legislacao = f.legislation;

    feriado.variavel = [];
    angular.forEach(f.variableDates, function(value, key) {
      feriado.variavel[key] = new Date(key + '/' + value.split('/')[1] + '/' + value.split('/')[0]);
    });

    return feriado;
  }

  return Feriado;

}
