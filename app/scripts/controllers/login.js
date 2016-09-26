/**
 * Created by egmfilho on 21/06/16.
 */
'use strict';

angular.module('belissimaApp.controllers')
  .controller('LoginCtrl', ['$rootScope', '$location', 'AuthenticationService', function($rootScope, $location, authentication) {

    this.logar = function(username, password) {
      authentication.login(username, password, function(res) {

        switch (res.status.code) {
          case 401:
            // $rootScope.alerta.show('Usuário não autorizado!');
            console.log('Usuário não autorizado!');
            break;
          case 404:
            // $rootScope.alerta.show('Usuário ou senhas inválidos!');
            console.log('Usuário ou senhas inválidos!');
            break;
          case 200:
            // $rootScope.alerta.show('Login efetuado!', 'alert-success');
            console.log('Login efetuado!');
            $location.path('#/home');
            break;
          default:
            break;
        }
      });
    };

    this.avancar = function() {
      jQuery('input[name="senha"]').focus().select();
    };

  }]);
