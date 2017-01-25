/**
 * Created by egmfilho on 01/08/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('TipoEvento', [function() {

    function TipoEvento(tipo) {
      this.id = tipo ? tipo.id : '';
      this.color = tipo ? tipo.color : '#fefefe';
      this.textColor = tipo ? tipo.textColor : '#333333';
      this.title = tipo ? tipo.title : '';
      this.description = tipo ? tipo.description : '';
      this.data = tipo ? tipo.data : '';
      this.update = tipo ? tipo.update : '';
    }

    TipoEvento.converterEmEntrada = function(eventType) {
      var tipo = { };

      tipo.color = eventType.event_type_color;
      tipo.description = eventType.event_type_description;
      tipo.id = eventType.event_type_id;
      tipo.title = eventType.event_type_name;
      tipo.textColor = eventType.event_type_text_color;
      tipo.data = new Date(eventType.event_type_date);
      tipo.update = eventType.event_type_update ? new Date(eventType.event_type_update) : null;

      return tipo;
    };

    TipoEvento.converterEmSaida = function(tipo) {
      var eventType = { };

      eventType.event_type_color = tipo.color.toUpperCase();
      eventType.event_type_description = tipo.description;
      eventType.event_type_id = tipo.id;
      eventType.event_type_name = tipo.title;
      eventType.event_type_text_color = tipo.textColor.toUpperCase();

      return eventType;
    };

    return TipoEvento;

  }]);
