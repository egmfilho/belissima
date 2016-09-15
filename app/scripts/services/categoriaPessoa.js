/**
 * Created by egmfilho on 15/09/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('CategoriaPessoa', [function() {

    function CategoriaPessoa(tipo) {
      this.id = tipo ? tipo.id : '';
      this.nome = tipo ? tipo.nome : '';
      this.nomeFormatado = tipo ? tipo.nomeFormatado : '';
    }

    CategoriaPessoa.converterEmEntrada = function(category) {
      var categoria = { };

      categoria.id = category.person_category_id;
      categoria.nome = category.person_category_name;
      categoria.nomeFormatado = category.person_category_name_formatted.toString().toLowerCase();

      return categoria;
    };

    CategoriaPessoa.converterEmSaida = function(categoria) {
      var category = { };

      category.person_category_id = categoria.id;
      category.person_category_name = categoria.nome;
      category.person_category_name_formatted = categoria.nomeFormatado;

      return category;
    };

    return CategoriaPessoa;

  }]);
