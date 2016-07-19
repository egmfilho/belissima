/**
 * Created by egmfilho on 19/07/16.
 */
'use strict';

angular.module('belissimaApp')
  .factory('Pessoa', [function() {

    var pessoa;

    pessoa.enderecos = [];
    pessoa.contatos = [];

    return {
      novaPessoa: function(codigo, nome, apelido) {
        pessoa.codigo = codigo;
        pessoa.nome = nome;
        pessoa.apelido = apelido;

        pessoa.dataCadastro = new Date();
        pessoa.dataUltimaAtualizacao = new Date();
      },

      setTipo: function(tipo) {
        pessoa.tipo = tipo;
      },

      setCPF_CNPJ: function(cpf_cnpj) {
        pessoa.cpf_cnpj = cpf_cnpj;
      },

      addEndereco: function(endereco) {
        pessoa.enderecos.push(endereco);
      },

      addContato: function(contato) {
        pessoa.contatos.push(contato);
      }
    }

  }]);
