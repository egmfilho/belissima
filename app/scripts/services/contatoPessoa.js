/**
 * Created by egmfilho on 03/08/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('ContatoPessoa', ['DataSaida', 'TipoContato', function(data, TipoContato) {

    function ContatoPessoa(contatoPessoa) {
      this.id = contatoPessoa ? contatoPessoa.id : '';
      this.pessoaId = contatoPessoa ? contatoPessoa.pessoaId : '';
      this.tipoId = contatoPessoa ? contatoPessoa.tipoId : '';
      this.tipoContato = contatoPessoa ? contatoPessoa.tipoContato : '';
      this.contato = contatoPessoa ? contatoPessoa.contato : '';
      this.principal = contatoPessoa ? contatoPessoa.principal : false;
      this.referencia = contatoPessoa ? contatoPessoa.referencia : '';
      this.data = contatoPessoa ? contatoPessoa.data : '';
    }

    ContatoPessoa.converterEmEntrada = function(personContact) {
      var contatoPessoa = { };

      contatoPessoa.id = personContact.person_contact_id;
      contatoPessoa.pessoaId = personContact.person_id;
      contatoPessoa.tipoId = personContact.person_contact_type_id;

      if (personContact.person_contact_type) {
        contatoPessoa.tipoContato = new TipoContato(TipoContato.converterEmEntrada(personContact.person_contact_type));
      } else {
        contatoPessoa.tipoContato = new TipoContato();
      }

      contatoPessoa.contato = personContact.person_contact_value;
      contatoPessoa.principal = personContact.person_contact_main === 'Y';
      contatoPessoa.referencia = personContact.person_contact_name;
      contatoPessoa.data = personContact.person_contact_date;

      return contatoPessoa;
    };

    ContatoPessoa.converterEmSaida = function(contatoPessoa) {
      var personContact = { };

      personContact.person_contact_id = contatoPessoa.id;
      personContact.person_id = contatoPessoa.pessoaId;
      personContact.person_contact_type_id = contatoPessoa.tipoId;
      personContact.person_contact_value = contatoPessoa.contato;
      personContact.person_contact_name = contatoPessoa.referencia ? contatoPessoa.referencia : null;
      personContact.person_contact_main = contatoPessoa.principal ? 'Y' : 'F';
      //personContact.person_contact_date = data.converter(contatoPessoa.data);

      return personContact;
    };

    return ContatoPessoa;
  }]);
