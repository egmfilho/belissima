/**
 * Created by egmfilho on 20/07/16.
 */
'use strict';

angular.module('belissimaApp')
  .directive('tela', ['$window', function($window) {

    function link(scope, element, attrs) {
      var headerHeight = parseInt(element.find('.header').css('height')),
          body = element.find('.body'),
          footerHeight = parseInt(scope.showFooter ? element.find('.footer').css('height') : '0');

      if (parseInt(body.css('height')) + headerHeight + footerHeight < $window.innerHeight) {
        body.css('min-height', ($window.innerHeight - headerHeight - footerHeight) + 'px');
      }

    }

    return {
      restrict: 'E',
      scope: {
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
