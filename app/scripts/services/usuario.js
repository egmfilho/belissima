/**
 * Created by egmfilho on 09/08/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('Usuario', ['PerfilUsuario', 'Pessoa', function (PerfilUsuario, Pessoa) {

    function Usuario(usuario) {
      this.id = usuario ? usuario.id : '';
      this.perfilId = usuario ? usuario.perfilId : '';
      this.pessoaId = usuario ? usuario.pessoaId : '';
      this.pessoa = usuario ? usuario.pessoa : new Pessoa();
      this.sessao = usuario ? usuario.sessao : '';
      this.ativo = usuario ? usuario.ativo : true;
      this.nome = usuario ? usuario.nome : '';
      this.usuario = usuario ? usuario.usuario : '';
      this.senha = usuario ? usuario.senha : '';
      this.email = usuario ? usuario.email : '';
      this.ultimoAcesso = usuario ? usuario.ultimoAcesso : new Date();

      this.perfil = usuario ? new PerfilUsuario(usuario.perfil) : new PerfilUsuario();
    }

    Usuario.prototype = {
      setPessoa: function(pessoa) {
        this.pessoa = new Pessoa(pessoa);
        this.pessoaId = this.pessoa.id;
      },
      setPerfil: function(perfil) {
        this.perfil = new PerfilUsuario(perfil);
        this.perfilId = perfil.id;
      }
    };

    Usuario.converterEmEntrada = function (user) {
      var usuario = {};

      usuario.id = user.user_id;
      usuario.perfilId = user.user_profile_id;
      usuario.pessoaId = user.person_id;
      usuario.pessoa = user.user_person ? new Pessoa(Pessoa.converterEmEntrada(user.user_person)) : new Pessoa();
      usuario.sessao = user.user_current_session_id;
      usuario.ativo = user.user_active == 'Y';
      usuario.nome = user.user_name;
      usuario.usuario = user.user_user;
      usuario.email = user.user_mail;
      usuario.ultimoAcesso = user.user_login ? new Date(user.user_login) : null;

      if (user.user_profile) {
        usuario.perfil = new PerfilUsuario(PerfilUsuario.converterEmEntrada(user.user_profile));
      } else {
        usuario.perfil = new PerfilUsuario();
      }

      return usuario;
    };

    Usuario.converterEmSaida = function (usuario) {
      var user = { };

      user.user_id = usuario.id;
      user.user_profile_id = usuario.perfilId;
      user.person_id = usuario.pessoaId;
      user.user_active = usuario.ativo;
      user.user_user = usuario.usuario;
      user.user_pass = usuario.senha;
      user.user_name = usuario.nome;
      user.user_mail = usuario.email;

      //user.user_profile_access = PerfilUsuario.converterEmSaida(usuario.perfil).user_profile_access;

      return user;
    };

    return Usuario;

  }]);

