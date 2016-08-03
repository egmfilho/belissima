/**
 * Created by egmfilho on 03/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .factory('Bairro', ['DataSaida', function(data) {

    function Bairro(bairro) {
      this.id = bairro.id;
      this.codigo = bairro.codigo;
      this.nome = bairro.nome;
      this.data = bairro.data;
    }

    Bairro.converterEmEntrada = function(district) {
      var bairro = { };

      bairro.id = district.district_id;
      bairro.codigo = district.district_code;
      bairro.nome = district.district_name;
      bairro.data = new Date(district.district_date);

      return bairro;
    };

    Bairro.converterEmSaida = function(bairro) {
      var district = { };

      district.id = bairro.id;
      district.codigo = bairro.codigo;
      district.nome = bairro.nome;
      district.data = data.converter(bairro);

      return district;
    };

    return Bairro;

  }]);
