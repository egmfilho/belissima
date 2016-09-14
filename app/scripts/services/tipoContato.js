/**
 * Created by egmfilho on 03/08/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('TipoContato', ['DataSaida', function(data) {

    function TipoContato(tipoContato) {
      this.id = tipoContato ? tipoContato.id : '';
      this.nome = tipoContato ? tipoContato.nome : '';
      this.mascara = tipoContato ? tipoContato.mascara : '';
      this.data = tipoContato ? tipoContato.data : '';
    }

    TipoContato.converterEmEntrada = function(contactType) {
      var tipoContato = { };

      tipoContato.id = contactType.person_contact_type_id;
      tipoContato.nome = contactType.person_contact_type_name;
      tipoContato.mascara = contactType.person_contact_type_mask;
      tipoContato.data = contactType.person_contact_type_date;

      return tipoContato;
    };

    TipoContato.converterEmSaida = function(tipoContato) {
      var contactType = { };

      contactType.person_contact_type_id = tipoContato.id;
      contactType.person_contact_type_name = tipoContato.nome;
      contactType.person_contact_type_mask = tipoContato.mascara;
      contactType.person_contact_type_date = data.converter(tipoContato.data);

      return contactType;
    };

    return TipoContato;

  }]);
