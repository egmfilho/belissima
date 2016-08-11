/**
 * Created by egmfilho on 01/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .factory('TipoEvento', [function() {

    function TipoEvento(tipo) {
      this.id = tipo ? tipo.id : '';
      this.color = tipo ? tipo.color : '';
      this.textColor = tipo ? tipo.textColor : '';
      this.title = tipo ? tipo.title : '';
      this.description = tipo ? tipo.description : '';
    }

    TipoEvento.converterEmEntrada = function(eventType) {
      var tipo = { };

      tipo.color = eventType.event_type_color;
      tipo.description = eventType.event_type_description;
      tipo.id = eventType.event_type_id;
      tipo.title = eventType.event_type_name;
      tipo.textColor = eventType.event_type_text_color;

      return tipo;
    };

    TipoEvento.converterEmSaida = function(tipo) {
      var eventType;

      eventType.event_type_color = tipo.color;
      eventType.event_type_description = tipo.description;
      eventType.event_type_id = tipo.id;
      eventType.event_type_name = tipo.title;
      eventType.event_type_text_color = tipo.textColor;

      return eventType;
    };

    return TipoEvento;

  }]);
