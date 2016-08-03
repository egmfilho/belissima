/**
 * Created by egmfilho on 03/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .factory('ContatoPessoa', ['DataSaida', 'TipoContato', function(data, TipoContato) {

    function ContatoPessoa(contatoPessoa) {
      this.id = contatoPessoa.id;
      this.pessoaId = contatoPessoa.pessoaId;
      this.tipoId = contatoPessoa.tipoId;
      this.tipoContato = contatoPessoa.tipoContato;
      this.contato = contatoPessoa.contato;
      this.nome = contatoPessoa.nome;
      this.data = contatoPessoa.data;
    }

    ContatoPessoa.converterEmEntrada = function(personContact) {
      var contatoPessoa = { };

      contatoPessoa.id = personContact.person_contact_id;
      contatoPessoa.pessoaId = personContact.person_id;
      contatoPessoa.tipoId = personContact.person_contact_type_id;

      if (personContact.person_contact_type) {
        contatoPessoa.tipoContato = new TipoContato(TipoContato.converterEmEntrada(personContact.person_contact_type));
      } else {
        contatoPessoa.tipoContato = { };
      }

      contatoPessoa.contato = personContact.person_contact_value;
      contatoPessoa.nome = personContact.person_contact_name;
      contatoPessoa.data = personContact.person_contact_date;

      return contatoPessoa;
    };

    ContatoPessoa.converterEmSaida = function(contatoPessoa) {
      var personContact = { };

      personContact.person_contact_id = contatoPessoa.id;
      personContact.person_id = contatoPessoa.pessoaId;
      personContact.person_contact_type_id = contatoPessoa.tipoId;
      personContact.person_contact_value = contatoPessoa.contato;
      personContact.person_contact_name = contatoPessoa.nome;
      personContact.person_contact_date = data.converter(contatoPessoa.data);

      return personContact;
    };

    return ContatoPessoa;
  }]);
