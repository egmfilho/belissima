/**
 * Created by egmfilho on 09/08/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('Usuario', [function() {

    function Usuario(usuario) {
      this.id = usuario ? usuario.id : '';
      this.perfilId = usuario ? usuario.perfilId : '';
      this.sessao = usuario ? usuario.sessao : '';
      this.ativo = usuario ? usuario.ativo : true;
      this.nome = usuario ? usuario.nome : '';
      this.email = usuario ? usuario.email : '';
    }

    Usuario.converterEmEntrada = function(user) {
      var usuario = { };

      usuario.id = user.user_id;
      usuario.perfilId = user.user_profile_id;
      usuario.sessao = user.user_session_id;
      usuario.ativo = user.user_active == 'Y' ? true : false;
      usuario.nome = user.user_name;
      usuario.email = user.user_mail;

      return usuario;
    };

    return Usuario;

  }]);
