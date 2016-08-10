/**
 * Created by egmfilho on 03/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .factory('Endereco', ['DataSaida', 'CEP', function(data, CEP) {

    function Endereco(endereco) {
      this.id = endereco ? endereco.id : '';
      this.pessoaId = endereco ? endereco.pessoaId : '';
      this.cepId = endereco ? endereco.cepId : '';
      this.codigo = endereco ? endereco.codigo : '';
      this.logradouro = endereco ? endereco.logradouro : '';
      this.tipo = endereco ? endereco.tipo : '';
      this.numero = endereco ? endereco.numero : '';
      this.complemento = endereco ? endereco.complemento : '';
      //this.data = endereco ? endereco.data : '';
      this.cep = endereco ? endereco.cep : '';
    }

    Endereco.prototype = {
      getEnderecoCompleto: function() {
        return this.tipo + ' ' + this.logradouro + ' ' + this.numero + ', ' + this.cep.bairro.nome + ', ' + this.cep.cidade.nome + ' - ' + this.cep.cidade.uf;
      }
    };

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
      //endereco.data = new Date(address.person_address_date);

      if (address.cep) {
        endereco.cep = new CEP(CEP.converterEmEntrada(address.cep));
      } else {
        endereco.cep = new CEP();
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
      //address.person_address_date = data.converterEmSaida(endereco.data);

      return address;
    };

    return Endereco;

  }]);