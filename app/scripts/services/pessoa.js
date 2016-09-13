/**
 * Created by egmfilho on 19/07/16.
 */
'use strict';

angular.module('belissimaApp.services')
  .factory('Pessoa', ['ContatoPessoa', 'Endereco', function(ContatoPessoa, Endereco) {

    function Pessoa(pessoa) {
      this.id = pessoa ? pessoa.id : '';
      this.ativo = pessoa ? pessoa.ativo : '';
      this.codigo = pessoa ? pessoa.codigo : '';
      this.tipo = pessoa ? pessoa.tipo : '';
      this.cnpj = pessoa ? pessoa.cnpj : '';
      this.rg = pessoa ? pessoa.rg : '';
      this.cpf = pessoa ? pessoa.cpf : '';
      this.nome = pessoa ? pessoa.nome : '';
      this.apelido = pessoa ? pessoa.apelido : '';
      this.contatos = pessoa ? pessoa.contatos : '';
      this.enderecos = pessoa ? pessoa.enderecos : '';
    }

    Pessoa.prototype = {

      getEnderecoPrincipalEmString: function() {
        return this.enderecos[0].getEnderecoCompleto();
      },

      getContatoPrincipalEmString: function() {

      }

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

      pessoa.contatos = [ ];
      if (person.person_contact) {
        angular.forEach(person.person_contact, function(item, index) {
          pessoa.contatos.push(new ContatoPessoa(ContatoPessoa.converterEmEntrada(item)));
        });
      } else {
        angular.forEach(person.person_contact, function(item, index) {
          pessoa.contatos.push(new ContatoPessoa());
        });
      }

      pessoa.enderecos = [ ];
      if (person.person_address) {
        angular.forEach(person.person_address, function(item, index) {
          pessoa.enderecos.push(new Endereco(Endereco.converterEmEntrada(item)));
        });
      } else {
        angular.forEach(person.person_address, function(item, index) {
          pessoa.enderecos.push();
        });
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
