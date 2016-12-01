/**
 * Created by egmfilho on 20/07/16.
 */
'use strict';

angular.module('belissimaApp.directives')
  .directive('tela', ['$rootScope', '$timeout', '$window', function($rootScope, $timeout, $window) {

    function link(scope, element, attrs) {
      var headerHeight = $window.innerWidth >= 768 ? parseInt(element.find('.header').css('height')) : parseInt(element.find('.header-xs').css('height')),
          body = element.find('.body'),
          footerHeight = parseInt(scope.showFooter ? element.find('.footer').css('height') : '0');

      if (parseInt(body.css('height')) + headerHeight + footerHeight < $window.innerHeight) {
        body.css('min-height', ($window.innerHeight - headerHeight - footerHeight) + 'px');
      }

      scope.currentPath = $rootScope.currentPath;
      scope.versao = $rootScope.versao;

      // relogio
      function atualizaHora() {
        scope.relogio = new Date();

        $timeout(function() {
          atualizaHora();
        }, 1000);
      }
      atualizaHora();
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
