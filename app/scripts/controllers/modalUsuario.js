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
    'descontos',
    'ModalBuscarPessoa',
    'Pessoa',
    function ($rootScope, $scope, $uibModalInstance, provider, Usuario, usuario, perfis, permissoes, descontos, modalBuscarPessoa, Pessoa) {

      var self = this;

      this.tabelasDesconto = descontos || [];
      self.usuario = new Usuario(usuario);
      self.perfis = perfis; // para usar no select
      console.log(this.usuario, perfis);

      $uibModalInstance.opened.then(function () {
        console.log(self.tabelasDesconto);
        setTimeout(function() {
          jQuery('.selectpicker').selectpicker();
        }, 200);

        if (!self.usuario.perfil.permissoes) {
          self.usuario.perfil.permissoes = permissoes;
        }
        if (!self.usuario.perfilId) {
          self.usuario.setPerfil(self.perfis[0]);
        }
      });

      function validarCadastro() {
        if (!self.usuario.nome) {
          $rootScope.alerta.show('Preencha o nome do usuário!');
          return false;
        }

        // if (!self.usuario.person_id) {
        //   $rootScope.alerta.show('Informe a pessoa!');
        //   return false;
        // }

        if (!self.usuario.usuario) {
          $rootScope.alerta.show('Preencha o nome de usuário!');
          return false;
        } else if (self.usuario.usuario.length < 6) {
          $rootScope.alerta.show('Usuário precisa ter no mínimo 6 caracteres!');
          return false;
        } else if (/[^0-9^a-z^A-Z^_]/g.test(self.usuario.usuario)) {
          $rootScope.alerta.show('Caracteres inválidos no nome de usuário!');
          return false;
        }

        if (!self.usuario.id) {
          if (!self.usuario.senha || !self.senhaCheck) {
            $rootScope.alerta.show('Preencha a senha do usuário!');
            return false;
          } else if(self.usuario.senha.length < 6) {
            $rootScope.alerta.show('Senha precisa ter no mínimo 6 caracteres!');
            return false;
          } else if (self.usuario.senha !== self.senhaCheck) {
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
      //  $rootScope.loading.load();
      //  provider.excluir(self.usuario.id).then(function (success) {
      //    $rootScope.loading.unload();
      //    $uibModalInstance.close('Usuário excluído!');
      //  }, function (error) {
      //    console.log(error);
      //    $rootScope.loading.unload();
      //  });
      //};

      $scope.salvar = function () {
        if (!validarCadastro()) {
          return;
        }

        console.log(Usuario.converterEmSaida(self.usuario));

        $rootScope.loading.load();
        if (self.usuario.id) {
          provider.editar(Usuario.converterEmSaida(self.usuario)).then(function (success) {
            $rootScope.loading.unload();
            $rootScope.alerta.show('Usuário "' + self.usuario.usuario + '" editado!', 'alert-success');
            $uibModalInstance.close(true);
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
            if (error.status === 420) {
              $rootScope.alerta.show('Nome de usuário ja registrado!', 'alert-danger');
            }
          });
        } else {
          provider.adicionar(Usuario.converterEmSaida(self.usuario)).then(function (success) {
            $rootScope.loading.unload();
            $rootScope.alerta.show('Usuário registrado com sucesso!', 'alert-success');
            $uibModalInstance.close(true);
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
            if (error.status === 420) {
              $rootScope.alerta.show('Nome de usuário ja registrado!', 'alert-danger');
            }
          });
        }
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss();
      };

      $scope.buscarPessoa = function() {
        modalBuscarPessoa.show().then(function(result) {
          if (result) {
            self.usuario.setPessoa(result);
          }
        });
      };

      $scope.removerPessoa = function() {
        self.usuario.setPessoa(new Pessoa());
      };

      $scope.teste = function() {
        console.log(self.usuario.tabelasDescontoIds);
      };
    }
  ]);
