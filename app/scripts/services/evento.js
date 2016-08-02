/**
 * Created by egmfilho on 01/08/16.
 */
angular.module('belissimaApp')
  .factory('Evento', ['$filter', 'TipoEvento', 'Pessoa', function($filter, TipoEvento, Pessoa) {

    function Evento(evento) {
      this.id = evento.id;
      this.title = evento.title;
      this.description = evento.description;
      this.start = evento.start;
      this.end = evento.end;
      this.funcionarioId = evento.funcionarioId;
      this.clienteId = evento.clienteId;
      this.produtoId = evento.produtoId;
      this.tipoId = evento.tipoId;
      this.tipoEvento = evento.tipoEvento;
      this.color = evento.color;
      this.textColor = evento.textColor;
      this.cliente = evento.cliente;
      this.funcionario = evento.funcionario;
    }

    Evento.prototype = {
      setTipo: function(tipo) {
        this.tipoEvento = new TipoEvento(tipo);
        this.color = this.tipoEvento.color;
        this.textColor = this.tipoEvento.textColor;
        this.tipoId = this.tipoEvento.id;
      },

      setCliente: function(pessoa) {
        this.cliente = new Pessoa(pessoa);
        this.clienteId = this.cliente.id;
      },

      setFuncionario: function(pessoa) {
        this.funcionario = new Pessoa(pessoa);
        this.funcionarioId = this.funcionario.id;
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
      evento.produtoId = event.event_product_id;
      evento.tipoId = event.event_type_id;

      if (event.event_type) {
        evento.tipoEvento = new TipoEvento(TipoEvento.converterEmEntrada(event.event_type));
        evento.color = evento.tipoEvento.color;
        evento.textColor = evento.tipoEvento.textColor;
      } else {
        evento.tipoEvento = { };
      }

      if (event.event_client) {
        evento.cliente = new Pessoa(Pessoa.converterEmEntrada(event.event_client));
      } else {
        evento.cliente = { };
      }

      if (event.event_employee) {
        evento.funcionario = new Pessoa(Pessoa.converterEmEntrada(event.event_employee));
      } else {
        evento.funcionario = { };
      }

      if (event.event_product) {
        //evento.produto = new
      } else {
        evento.produto = { };
      }

      return evento;
    };

    Evento.converterEmSaida = function(evento) {
      var event = { };

      event.event_id = evento.id;
      event.event_type_id = evento.tipoId;
      event.event_name = evento.title;
      event.event_description = evento.description;
      event.event_start = $filter('date')(new Date(evento.start), 'yyyy-MM-dd HH:mm:ss');
      event.event_end = $filter('date')(new Date(evento.end), 'yyyy-MM-dd HH:mm:ss');
      event.event_employee_id = evento.funcionarioId;
      event.event_client_id = evento.clienteId;
      event.event_product_id = evento.produtoId;

      return event;
    };

    return Evento;

  }]);
