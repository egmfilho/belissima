/**
 * Created by egmfilho on 03/08/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('Bairro', ['DataSaida', function(data) {

    function Bairro(bairro) {
      this.id = bairro ? bairro.id : '';
      this.codigo = bairro ? bairro.codigo : '';
      this.nome = bairro ? bairro.nome : '';
      this.data = bairro ? bairro.data : new Date();
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

      district.district_id = bairro.id;
      district.district_code = bairro.codigo;
      district.district_name  = bairro.nome;

      return district;
    };

    return Bairro;

  }]);
