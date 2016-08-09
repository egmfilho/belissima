/**
 * Created by egmfilho on 09/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .factory('Unidade', [function() {

    function Unidade(unidade) {
      this.id = unidade ? unidade.id : '';
      this.codigo = unidade ? unidade.codigo : '';
      this.valor = unidade ? unidade.valor : '';
      this.nome = unidade ? unidade.nome : '';
    }

    Unidade.converterEmEntrada = function(unit) {
      var unidade = { };

      unidade.id = unit.product_unit_id;
      unidade.codigo = unit.product_unit_code;
      unidade.valor = unit.product_unit_sign;
      unidade.nome = unit.product_unit_name;

      return unidade;
    };

    return Unidade;

  }]);
