/**
 * Created by egmfilho on 03/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .factory('Endereco', ['DataSaida', 'CEP', function(data, CEP) {

    function Endereco(endereco) {
      this.id = endereco.id;
      this.pessoaId = endereco.pessoaId;
      this.cepId = endereco.cepId;
      this.codigo = endereco.codigo;
      this.logradouro = endereco.logradouro;
      this.tipo = endereco.tipo;
      this.numero = endereco.numero;
      this.complemento = endereco.complemento;
      this.data = endereco.data;
      this.cep = endereco.cep;
    }

    Endereco.converterEmEntrada = function(address) {
      var endereco = { };

      endereco.id = address.person_address_id;
      endereco.pessoaId = address.person_id;
      endereco.cepId = address.cep_id;
      endereco.codigo = address.person_address_code;
      endereco.logradouro = address.person_address_public_place;
      endereco.tipo = address.person_address_type;
      endereco.numero = address.person_address_number;
      endereco.complemento = address.person_address_complement;
      endereco.data = new Date(address.person_address_date);

      if (address.cep) {
        endereco.cep = new CEP(CEP.converterEmEntrada(adress.cep));
      } else {
        endereco.cep = { };
      }

      return endereco;
    };

    Endereco.converterEmSaida = function(endereco) {
      var address = { };

      address.person_address_id = endereco.id;
      address.person_id = endereco.pessoaId;
      address.cep_id = endereco.cepId;
      address.person_address_code = endereco.codigo;
      address.person_address_public_place = endereco.logradouro;
      address.person_address_type = endereco.tipo;
      address.person_address_number = endereco.numero;
      address.person_address_complement = endereco.complemento;
      address.person_address_date = data.converterEmSaida(endereco.data);

      return address;
    };

    return Endereco;

  }]);
