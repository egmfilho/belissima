/**
 * Created by egmfilho on 05/10/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('ModalUsuarioCtrl', [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'ProviderUsuario',
    'Usuario',
    'usuario',
    'perfis',
    'permissoes',
    function ($rootScope, $scope, $uibModalInstance, provider, Usuario, usuario, perfis, permissoes) {

      var self = this;

      $uibModalInstance.opened.then(function () {
        self.usuario = new Usuario(usuario);
        self.perfis = perfis; // para usar no select
        if (!self.usuario.perfil.permissoes) {
          self.usuario.perfil.permissoes = permissoes;
        }
      });

      function validarCadastro() {
        if (!self.usuario.nome) {
          $rootScope.alerta.show('Preencha o nome do usuário!');
          return false;
        }

        if (!self.usuario.usuario) {
          $rootScope.alerta.show('Preencha o nome de usuário!');
          return false;
        }

        if (!self.usuario.id) {
          if (!self.usuario.senha || !self.senhaCheck) {
            $rootScope.alerta.show('Preencha a senha do usuário!');
            return false;
          }

          if (self.usuario.senha !== self.senhaCheck) {
            $rootScope.alerta.show('As senhas não conferem!');
            return false;
          }
        }

        if (!self.usuario.perfilId) {
          $rootScope.alerta.show('Selecione um perfil!');
          return false;
        }

        return true;
      }

      //$scope.excluir = function () {
      //  $rootScope.isLoading = true;
      //  provider.excluir(self.usuario.id).then(function (success) {
      //    $rootScope.isLoading = false;
      //    $uibModalInstance.close('Usuário excluído!');
      //  }, function (error) {
      //    console.log(error);
      //    $rootScope.isLoading = false;
      //  });
      //};

      $scope.salvar = function () {
        if (!validarCadastro()) {
          return;
        }

        console.log(Usuario.converterEmSaida(self.usuario));

        $rootScope.isLoading = true;
        if (self.usuario.id) {
          provider.editar(Usuario.converterEmSaida(self.usuario)).then(function (success) {
            $rootScope.isLoading = false;
            $rootScope.alerta.show('Usuário "' + self.usuario.usuario + '" editado!', 'alert-success');
            $uibModalInstance.close(true);
          }, function (error) {
            console.log(error);
            $rootScope.isLoading = false;
            if (error.status === 420) {
              $rootScope.alerta.show('Nome de usuário ja registrado!', 'alert-danger');
            }
          });
        } else {
          provider.adicionar(Usuario.converterEmSaida(self.usuario)).then(function (success) {
            $rootScope.isLoading = false;
            $rootScope.alerta.show('Usuário registrado com sucesso!', 'alert-success');
            $uibModalInstance.close(true);
          }, function (error) {
            console.log(error);
            $rootScope.isLoading = false;
            if (error.status === 420) {
              $rootScope.alerta.show('Nome de usuário ja registrado!', 'alert-danger');
            }
          });
        }
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss();
      };
    }
  ]);