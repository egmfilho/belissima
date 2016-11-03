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
        $rootScope.loading.load();
        self.usuarios = [];
        providerUsuario.obterTodos(true).then(function (success) {
          self.usuariosPagination.total = success.info.quantity;
          angular.forEach(success.data, function (item, index) {
            self.usuarios.push(new Usuario(Usuario.converterEmEntrada(item)));
          });
          console.log(success.data, self.usuarios);
          $rootScope.loading.unload();
        }, function (error) {
          $rootScope.loading.unload();
        });
      }

      function getPerfis() {
        $rootScope.loading.load();
        self.perfis = [];
        providerPerfil.obterTodos().then(function (success) {
          self.perfisPagination.total = success.info.quantity;
          angular.forEach(success.data, function (item, index) {
            self.perfis.push(new PerfilUsuario(PerfilUsuario.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getPermissoes() {
        $rootScope.loading.load();
        providerConfig.obterPermissoes().then(function (success) {
          self.permissoes = new PermissoesUsuario(PermissoesUsuario.converterEmEntrada(success.data));
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      this.atualizarUsuarios = function () {
        getUsuarios();
      };

      this.editarUsuario = function (usuario) {
        if (!self.perfis) {
          getPerfis();
        }

        $rootScope.loading.load();
        providerUsuario.obterPorId(usuario.id, true, true).then(function (success) {
          $rootScope.loading.unload();
          ModalUsuario.show(new Usuario(Usuario.converterEmEntrada(success.data)), self.perfis).then(function (success) {
            self.atualizarUsuarios();
          });
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
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
          $rootScope.loading.load();
          providerUsuario.excluir(usuario.id).then(function (success) {
            $rootScope.loading.unload();
            self.atualizarUsuarios();
            $rootScope.alerta.show('Usuário excluído!', 'alert-success');
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
          });
        });
      };

      this.atualizarPerfis = function () {
        getPerfis();
      };

      this.editarPerfil = function (perfil) {
        $rootScope.loading.load();
        providerPerfil.obterPorId(perfil.id, true).then(function (success) {
          $rootScope.loading.unload();
          ModalPerfil.show(new PerfilUsuario(PerfilUsuario.converterEmEntrada(success.data))).then(function (success) {
            self.atualizarPerfis();
          });
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
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
          $rootScope.loading.load();
          providerPerfil.excluir(perfil.id).then(function (success) {
            $rootScope.loading.unload();
            self.atualizarPerfis();
            $rootScope.alerta.show('Perfil excluído!', 'alert-success');
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
          });
        });
      }

    }]);
