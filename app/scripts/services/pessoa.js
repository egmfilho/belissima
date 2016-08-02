/**
 * Created by egmfilho on 19/07/16.
 */
'use strict';

angular.module('belissimaApp')
  .factory('Pessoa', [function() {

    function Pessoa(pessoa) {
      this.id = pessoa.id;
      this.ativo = pessoa.ativo;
      this.codigo = pessoa.codigo;
      this.tipo = pessoa.tipo;
      this.cnpj = pessoa.cnpj;
      this.rg = pessoa.rg;
      this.cpf = pessoa.cpf;
      this.nome = pessoa.nome;
      this.apelido = pessoa.apelido;
    }

    Pessoa.prototype = {

    };

    Pessoa.converterEmEntrada = function(person) {
      var pessoa = { };

      pessoa.id = person.person_id;
      pessoa.ativo = person.person_active;
      pessoa.codigo = person.person_code;
      pessoa.tipo = person.person_type;
      pessoa.cnpj = person.person_cnpj;
      pessoa.rg = person.person_rg;
      pessoa.cpf = person.person_cpf;
      pessoa.nome = person.person_name;
      pessoa.apelido = person.person_nickname;

      return pessoa;
    };

    Pessoa.converterEmSaida = function(pessoa) {
      var person = { };

      person.person_id = pessoa.id;
      person.person_active = pessoa.ativo;
      person.person_code = pessoa.codigo;
      person.person_type = pessoa.tipo;
      person.person_cnpj = pessoa.cnpj;
      person.person_rg = pessoa.rg;
      person.person_cpf = pessoa.cpf;
      person.person_name = pessoa.nome;
      person.person_nickname = pessoa.apelido;

      return person;
    };

    return Pessoa;

  }]);
