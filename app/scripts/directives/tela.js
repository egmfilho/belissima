/**
 * Created by egmfilho on 20/07/16.
 */
'use strict';

angular.module('belissimaApp.directives')
  .directive('tela', ['$window', function($window) {

    function link(scope, element, attrs) {
      var headerHeight = $window.innerWidth >= 768 ? parseInt(element.find('.header').css('height')) : parseInt(element.find('.header-xs').css('height')),
          body = element.find('.body'),
          footerHeight = parseInt(scope.showFooter ? element.find('.footer').css('height') : '0');
      console.log(headerHeight);

      if (parseInt(body.css('height')) + headerHeight + footerHeight < $window.innerHeight) {
        body.css('min-height', ($window.innerHeight - headerHeight - footerHeight) + 'px');
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
