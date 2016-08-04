/**
 * Created by egmfilho on 19/07/16.
 */
'use strict';

angular.module('belissimaApp')
  .factory('Pessoa', ['ContatoPessoa', 'Endereco', function(ContatoPessoa, Endereco) {

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
      this.contatos = pessoa.contatos;
      this.enderecos = pessoa.enderecos;
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

      if (person.person_contact) {
        pessoa.contatos = [ ];
        angular.forEach(person.person_contact, function(item, index) {
          pessoa.contatos.push(new ContatoPessoa(ContatoPessoa.converterEmEntrada(item)));
        });
      } else {
        pessoa.contatos = [ ];
      }

      if (person.person_address) {
        pessoa.enderecos = [ ]
        angular.forEach(person.person_address, function(item, index) {
          pessoa.enderecos.push(new Endereco(Endereco.converterEmEntrada(item)));
        });
      } else {
        pessoa.enderecos = { };
      }

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
