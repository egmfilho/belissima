/**
 * Created by egmfilho on 20/07/16.
 */
'use strict';

angular.module('belissimaApp.directives')
  .directive('tela', ['$rootScope', '$timeout', '$window', '$cookies', 'ProviderUsuario', function($rootScope, $timeout, $window, $cookies, providerUsuario) {

    function link(scope, element, attrs) {
      var headerHeight = $window.innerWidth >= 768 ? parseInt(element.find('.header').css('height')) : parseInt(element.find('.header-xs').css('height')),
          body = element.find('.tela > .body'),
          footerHeight = parseInt(scope.showFooter ? element.find('.footer').css('height') : '0');

      scope.$watch(function() {
        return parseInt(body.css('height'));
      }, function() {
        if (parseInt(body.css('height')) + headerHeight + footerHeight < $window.innerHeight) {
          body.css('min-height', ($window.innerHeight - headerHeight - footerHeight) + 'px');
        }
      });

      scope.currentPath = $rootScope.currentPath;
      scope.versao = $rootScope.versao;

      scope.usuario = JSON.parse(window.atob($cookies.get('currentUser')));

      // relogio
      function atualizaHora() {
        scope.relogio = new Date();

        $timeout(function() {
          atualizaHora();
        }, 1000);
      }
      atualizaHora();

      scope.abrirModalSenha = function() {
        jQuery('#modalSenha').on('show.bs.modal', function(e) {
          scope.novaSenha = '';
          scope.novaSenha2 = '';
        }).modal('show');
      };

      scope.trocarSenha = function(senha, senha2) {
        if (senha.length < 6 || senha.length < 6) {
          $rootScope.alerta.show('A senha precisa ter no mínimo 6 caracteres!', 'alert-danger');
          return;
        }

        if (senha !== senha2) {
          $rootScope.alerta.show('As senhas não conferem!', 'alert-danger');
          return;
        }

        $rootScope.loading.load();
        providerUsuario.novaSenha(scope.usuario.id, senha).then(function(success) {
          $rootScope.loading.unload();
          scope.novaSenha = '';
          scope.novaSenha2 = '';
          jQuery('#modalSenha').modal('hide');
          $rootScope.alerta.show('A senha foi redefinida!', 'alert-success');
        }, function(error) {
          $rootScope.loading.unload();
          console.log(error);
          $rootScope.alerta.show('Não foi possível redefinir a senha!', 'alert-danger');
        });
      }
    }

    return {
      restrict: 'E',
      scope: {
        id: '@',
        icon: '@',
        titulo: '@',
        subtitulo: '@',
        showFooter: '='
      },
      transclude: true,
      templateUrl: 'partials/tela.html',
      link: link
    };
  }]);
