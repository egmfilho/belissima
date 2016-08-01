/**
 * Created by egmfilho on 01/08/16.
 */
angular.module('belissimaApp')
  .factory('Evento', ['TipoEvento', function(TipoEvento) {

    function Evento(evento) {
      this.id = evento.id;
      this.title = evento.title;
      this.description = evento.description;
      this.start = evento.start;
      this.end = evento.end;
      this.funcionarioId = evento.funcionarioId;
      this.clienteId = evento.clienteId;
      this.tipoId = evento.tipoId;
      this.tipoEvento = evento.tipoEvento;
      this.color = evento.color;
      this.textColor = evento.textColor;
    }

    Evento.prototype = {
      setTipo: function(tipo) {
        this.tipoEvento = new TipoEvento(tipo);
        this.color = this.tipoEvento.color;
        this.textColor = this.tipoEvento.textColor;
        this.tipoId = this.tipoEvento.id;
      },

      log: function() {
        console.log(this);
      }
    };

    Evento.converterEmEntrada = function(event) {
      var evento = { };

      evento.id = event.event_id;
      evento.title = event.event_name;
      evento.description = event.event_description;
      evento.start = new Date(event.event_start);
      evento.end = new Date(event.event_end);
      evento.funcionarioId = event.event_employee_id;
      evento.clienteId = event.event_client_id;
      evento.tipoId = event.event_type_id;

      if (event.event_type) {
        evento.tipoEvento = new TipoEvento(TipoEvento.converterEmEntrada(event.event_type));
        evento.color = evento.tipoEvento.color;
        evento.textColor = evento.tipoEvento.textColor;
      } else {
        evento.tipoEvento = { };
      }

      return evento;
    };

    Evento.converterEmSaida = function(evento) {
      var event;

      event.event_id = this.id;
      event.event_name = this.title;
      event.event_description = this.description;
      event.event_start = this.start;
      event.event_end = this.end;
      event.event_employee_id = this.funcionarioId;
      event.event_client_id = this.clienteId;

      return event;
    };

    return Evento;

  }]);
