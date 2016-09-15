/**
 * Created by egmfilho on 19/07/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('Pessoa', ['ContatoPessoa', 'Endereco', 'CategoriaPessoa', function(ContatoPessoa, Endereco, CategoriaPessoa) {

    function Pessoa(pessoa) {
      this.id = pessoa ? pessoa.id : '';
      this.ativo = pessoa ? pessoa.ativo : true;
      this.codigo = pessoa ? pessoa.codigo : '';
      this.tipo = pessoa ? pessoa.tipo : 'F';
      this.cnpj = pessoa ? pessoa.cnpj : '';
      this.rg = pessoa ? pessoa.rg : '';
      this.cpf = pessoa ? pessoa.cpf : '';
      this.nome = pessoa ? pessoa.nome : '';
      this.apelido = pessoa ? pessoa.apelido : '';
      this.contatos = pessoa ? pessoa.contatos : [ ];
      this.enderecos = pessoa ? pessoa.enderecos : [ ];
      this.categorias = pessoa ? pessoa.categorias : [ ];
    }

    Pessoa.prototype = {

      setEnderecoPrincipal: function(index) {
        angular.forEach(this.enderecos, function(endereco, i) {
          endereco.principal = i === index;
        });
      },

      getEnderecoPrincipalEmString: function() {
        if (!this.enderecos.length) return '';

        for (var i = 0; i < this.enderecos.length; i++) {
          if (this.enderecos[i].principal) {
            return this.enderecos[i].getEnderecoCompleto();
          }
        }

        return this.enderecos[0].getEnderecoCompleto();
      },

      removerEndereco: function(index) {
        if (this.enderecos.splice(index, 1)[0].principal) {
          this.enderecos[0].principal = true;
        }
      },

      setContatoPrincipal: function(index) {
        angular.forEach(this.contatos, function(contato, i) {
          contato.principal = i === index;
        });
      },

      getContatoPrincipalEmString: function() {
        if (!this.contatos.length) return '';

        for (var i = 0; i < this.contatos.length; i++) {
          if (this.contatos[i].principal) {
            return this.contatos[i].contato.toString();
          }
        }
      },

      removerContato: function(index) {
        if (this.contatos.splice(index, 1)[0].principal) {
          this.contatos[0].principal = true;
        }
      }

    };

    Pessoa.converterEmEntrada = function(person) {
      var pessoa = { };

      pessoa.id = person.person_id;
      pessoa.ativo = person.person_active === 'Y';
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
      }

      pessoa.enderecos = [ ];
      if (person.person_address) {
        angular.forEach(person.person_address, function(item, index) {
          pessoa.enderecos.push(new Endereco(Endereco.converterEmEntrada(item)));
        });
      }

      pessoa.categorias = [ ];
      if (person.person_category) {
        angular.forEach(person.person_category, function(item, index) {
          pessoa.categorias.push(new CategoriaPessoa(CategoriaPessoa.converterEmEntrada(item)));
        });
      }

      return pessoa;
    };

    Pessoa.converterEmSaida = function(pessoa) {
      var person = { }, address = { }, contact = { };

      person.person_id = pessoa.id;
      person.person_active = pessoa.ativo ? 'Y' : 'N';
      person.person_code = pessoa.codigo;
      person.person_type = pessoa.tipo;
      person.person_cnpj = pessoa.cnpj.length ? pessoa.cnpj : null;
      person.person_rg = pessoa.rg.length ? pessoa.rg : null;
      person.person_cpf = pessoa.cpf.length ? pessoa.cpf : null;
      person.person_name = pessoa.nome;
      person.person_nickname = pessoa.apelido.length ? pessoa.apelido : null;

      person.person_address = [ ];
      angular.forEach(pessoa.enderecos, function(endereco, index) {
        person.person_address.push(Endereco.converterEmSaida(endereco));
      });

      person.person_contact = [ ];
      angular.forEach(pessoa.contatos, function(contato, index) {
        person.person_contact.push(ContatoPessoa.converterEmSaida(contato));
      });

      person.person_category = [ ];
      angular.forEach(pessoa.categorias, function(categoria, index) {
        person.person_category.push(CategoriaPessoa.converterEmSaida(categoria))
      });

      return person;
    };

    return Pessoa;

  }]);
