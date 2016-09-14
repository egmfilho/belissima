/**
 * Created by egmfilho on 19/07/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('Pessoa', ['ContatoPessoa', 'Endereco', function(ContatoPessoa, Endereco) {

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
      this.contatos = pessoa ? pessoa.contatos : '';
      this.enderecos = pessoa ? pessoa.enderecos : '';
    }

    Pessoa.prototype = {

      setEnderecoPrincipal: function(index) {
        angular.forEach(this.enderecos, function(endereco, i) {
          endereco.principal = i === index;
        });
      },

      getEnderecoPrincipalEmString: function() {
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
      var person = { }, address = { }, contact = { };

      person.person_id = pessoa.id;
      person.person_active = pessoa.ativo ? 'Y' : 'N';
      person.person_code = pessoa.codigo;
      person.person_type = pessoa.tipo;
      person.person_cnpj = pessoa.cnpj;
      person.person_rg = pessoa.rg;
      person.person_cpf = pessoa.cpf;
      person.person_name = pessoa.nome;
      person.person_nickname = pessoa.apelido;

      person.person_address = [ ];
      angular.forEach(pessoa.enderecos, function(endereco, index) {
        address = { };
        address.cep_id = endereco.cepId;
        address.person_address_main = endereco.principal ? 'Y' : 'N';
        address.person_address_code = '0' + (index + 1).toString();
        address.person_address_type = endereco.tipo;
        address.person_address_number = endereco.numero;
        address.person_address_complement = endereco.complemento;
        person.person_address.push(address);
      });

      person.person_contact = [ ];
      angular.forEach(pessoa.contatos, function(contato, index) {
        contact = { };
        contact.person_contact_type_id = contato.tipoId;
        contact.person_contact_value = contato.contato;
        contact.person_contact_main = contato.principal ? 'Y' : 'N';
        contact.person_contact_name = contato.referencia;
        person.person_contact.push(contact);
      });

      return person;
    };

    return Pessoa;

  }]);
