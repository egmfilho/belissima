'use strict';

angular.module('belissimaApp.controllers')
  .controller('ConfiguracoesCtrl', [
    '$rootScope',
    '$scope',
    'ProviderUsuario',
    'Usuario',
    'ProviderPerfilUsuario',
    'PerfilUsuario',
    'ModalUsuario',
    'ModalPerfil',
    'ProviderConfig',
    'PermissoesUsuario',
    'ModalConfirm',
    function ($rootScope, $scope, providerUsuario, Usuario, providerPerfil, PerfilUsuario, ModalUsuario, ModalPerfil, providerConfig, PermissoesUsuario, modalConfirm) {

      var self = this;

      self.usuariosPagination = {
        current: 1,
        max: 15,
        total: 0
      };

      self.perfisPagination = {
        current: 1,
        max: 15,
        total: 0
      };

      $scope.$on('$viewContentLoaded', function () {
        getUsuarios();
        getPerfis();
        getPermissoes();
      });

      function getUsuarios() {
        $rootScope.isLoading = true;
        self.usuarios = [];
        providerUsuario.obterTodos(true).then(function (success) {
          self.usuariosPagination.total = success.info.quantity;
          angular.forEach(success.data, function (item, index) {
            self.usuarios.push(new Usuario(Usuario.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function (error) {
          $rootScope.isLoading = false;
        });
      }

      function getPerfis() {
        $rootScope.isLoading = true;
        self.perfis = [];
        providerPerfil.obterTodos().then(function (success) {
          self.perfisPagination.total = success.info.quantity;
          angular.forEach(success.data, function (item, index) {
            self.perfis.push(new PerfilUsuario(PerfilUsuario.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

      function getPermissoes() {
        $rootScope.isLoading = true;
        providerConfig.obterPermissoes().then(function (success) {
          self.permissoes = new PermissoesUsuario(PermissoesUsuario.converterEmEntrada(success.data));
          $rootScope.isLoading = false;
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

      this.atualizarUsuarios = function () {
        getUsuarios();
      };

      this.editarUsuario = function (usuario) {
        if (!self.perfis) {
          getPerfis();
        }

        $rootScope.isLoading = true;
        providerUsuario.obterPorId(usuario.id, true, true).then(function (success) {
          $rootScope.isLoading = false;
          ModalUsuario.show(new Usuario(Usuario.converterEmEntrada(success.data)), self.perfis).then(function (success) {
            self.atualizarUsuarios();
          });
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      this.adicionarUsuario = function () {
        if (!self.perfis) {
          getPerfis();
        }

        if (!self.permissoes) {
          getPermissoes();
        }

        ModalUsuario.show(new Usuario(), self.perfis, self.permissoes).then(function (success) {
          self.atualizarUsuarios();
        });
      };

      this.excluirUsuario = function (usuario) {
        modalConfirm.show(null, 'Excluir usuário "' + usuario.usuario + '"?').then(function() {
          $rootScope.isLoading = true;
          providerUsuario.excluir(usuario.id).then(function (success) {
            $rootScope.isLoading = false;
            self.atualizarUsuarios();
            $rootScope.alerta.show('Usuário excluído!', 'alert-success');
          }, function (error) {
            console.log(error);
            $rootScope.isLoading = false;
          });
        });
      };

      this.atualizarPerfis = function () {
        getPerfis();
      };

      this.editarPerfil = function (perfil) {
        $rootScope.isLoading = true;
        providerPerfil.obterPorId(perfil.id, true).then(function (success) {
          $rootScope.isLoading = false;
          ModalPerfil.show(new PerfilUsuario(PerfilUsuario.converterEmEntrada(success.data))).then(function (success) {
            self.atualizarPerfis();
          });
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      this.adicionarPerfil = function () {
        if (!self.permissoes) {
          getPermissoes();
        }

        ModalPerfil.show(new PerfilUsuario(), self.permissoes).then(function (success) {
          self.atualizarPerfis();
        });
      };

      this.excluirPerfil = function (perfil) {
        modalConfirm.show(null, 'Excluir perfil "' + perfil.nome + '"?').then(function() {
          $rootScope.isLoading = true;
          providerPerfil.excluir(perfil.id).then(function (success) {
            $rootScope.isLoading = false;
            self.atualizarPerfis();
            $rootScope.alerta.show('Perfil excluído!', 'alert-success');
          }, function (error) {
            console.log(error);
            $rootScope.isLoading = false;
          });
        });
      }

    }]);
