/**
 * Created by egmfilho on 19/07/16.
 */
'use strict';

angular.module('belissimaApp')
  .factory('Grupo', [function() {

    var grupo;

    return {
      novoGrupo: function(codigo, nome) {
        grupo.codigo = codigo;
        grupo.nome = nome;

        grupo.dataCadastro = new Date();
        grupo.dataUltimaAtualizacao = new Date();
      },

      setTipo: function(tipo) {
        grupo.tipo = tipo;
      }
    }

  }]);
