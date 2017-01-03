/**
 * Created by egmfilho on 09/08/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('TipoProduto', [function() {

    function TipoProduto(tipo) {
      this.id = tipo ? tipo.id : '';
      this.codigo = tipo ? tipo.codigo : '';
      this.nome = tipo ? tipo.nome : '';
      this.descricao = tipo ? tipo.descricao : '';
    }

    TipoProduto.converterEmEntrada = function(type) {
      var tipo = { };

      tipo.id = type.product_type_id;
      tipo.codigo = type.product_type_code;
      tipo.nome = type.product_type_name;
      tipo.descricao = type.product_type_description;

      return tipo;
    };

    return TipoProduto;

  }]);
