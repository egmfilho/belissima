/**
 * Created by egmfilho on 03/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .factory('CEP', ['DataSaida', 'Bairro', 'Cidade', function(data, Bairro, Cidade) {

    function CEP(cep) {
      this.id = cep.id;
      this.bairroId = cep.bairroId;
      this.bairro = cep.bairro;
      this.cidadeId = cep.cidadeId;
      this.cidade = cep.cidade;
      this.uf = cep.uf;
      this.codigo = cep.codigo;
      this.logradouro = cep.logradouro;
      this.data = cep.data;
    }

    CEP.converterEmEntrada = function(cep) {
      var c = {};

      c.id = cep.cep_id;
      c.bairroId = cep.district_id;

      if (cep.district) {
        c.bairro = new Bairro(Bairro.converterEmEntrada(cep.district));
      } else {
        c.bairro = {};
      }

      c.cidadeId = cep.city_id;

      if (cep.city) {
        c.cidade = new Cidade(Cidade.converterEmEntrada(cep.city));
      } else {
        c.cidade = { };
      }

      c.uf = cep.cep_uf;
      c.codigo = cep.cep_code;
      c.logradouro = cep.cep_public_place;
      c.data = new Date(cep.cep_date);

      return c;
    };

    CEP.converterEmSaida = function(cep) {
      var c = { };

      c.cep_id = cep.id;
      c.district_id = cep.bairroId;
      c.district = cep.bairro;
      c.city_id = cep.cidadeId;
      c.city = cep.cidade;
      c.cep_uf = cep.uf;
      c.cep_public_place = cep.logradouro;
      c.cep_date = data.converter(cep.data);

      return c;
    };

    return CEP;

  }]);
