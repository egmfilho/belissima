/**
 * Created by egmfilho on 01/08/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('Evento', [
    'DataSaida',
    'TipoEvento',
    'Pessoa',
    'Produto',
    function(data, TipoEvento, Pessoa, Produto) {

      function Evento(evento) {
        this.id = evento ? evento.id : '';
        this.title = evento ? evento.title : '';
        this.description = evento ? evento.description : '';
        this.start = evento ? evento.start : '';
        this.end = evento ? evento.end : '';
        this.funcionarioId = evento ? evento.funcionarioId : '';
        this.clienteId = evento ? evento.clienteId : '';
        this.produtoId = evento ? evento.produtoId : '';
        this.tipoId = evento ? evento.tipoId : '';
        this.tipoEvento = evento ? evento.tipoEvento : '';
        this.color = evento ? evento.color : '';
        this.textColor = evento ? evento.textColor : '';
        this.cliente = evento ? evento.cliente : '';
        this.funcionario = evento ? evento.funcionario : '';
        this.produto = evento ? evento.produto : '';
        this.resourceId = evento ? evento.resourceId : '';
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

        removeCliente: function() {
          this.cliente = new Pessoa();
          this.clienteId = null;
        },

        setFuncionario: function(pessoa) {
          this.funcionario = new Pessoa(pessoa);
          this.funcionarioId = this.funcionario.id;
        },

        removeFuncionario: function() {
          this.funcionario = new Pessoa();
          this.funcionarioId = null;
        },

        setProduto: function(produto) {
          this.produto = new Produto(produto);
          this.produtoId = this.produto.id;
        },

        removeProduto: function() {
          this.produto = new Produto();
          this.produtoId = null;
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

        if (event.event_type_id && event.event_type) {
          evento.tipoEvento = new TipoEvento(TipoEvento.converterEmEntrada(event.event_type));
          evento.color = evento.tipoEvento.color;
          evento.textColor = evento.tipoEvento.textColor;
        } else {
          evento.tipoEvento = new TipoEvento();
        }

        if (event.event_client_id && event.event_client) {
          evento.cliente = new Pessoa(Pessoa.converterEmEntrada(event.event_client));
        } else {
          evento.cliente = new Pessoa();
        }

        if (event.event_employee_id && event.event_employee) {
          evento.funcionario = new Pessoa(Pessoa.converterEmEntrada(event.event_employee));
        } else {
          evento.funcionario = new Pessoa();
        }

        if (event.event_product) {
          evento.produto = new Produto(Produto.converterEmEntrada(event.event_product));
        } else {
          evento.produto = new Produto();
        }

        evento.resourceId = evento.funcionarioId;

        return evento;
      };

      Evento.converterEmSaida = function(evento) {
        var event = { };

        event.event_id = evento.id;
        event.event_type_id = evento.tipoId;
        event.event_name = evento.title;
        event.event_description = evento.description;
        event.event_start = data.converter(new Date(evento.start));
        event.event_end = data.converter(new Date(evento.end));
        event.event_employee_id = evento.funcionarioId;
        event.event_client_id = evento.clienteId;
        event.event_product_id = evento.produtoId;

        return event;
      };

      return Evento;

  }]);
