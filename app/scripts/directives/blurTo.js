/**
 * Created by egmfilho on 05/12/16.
 */

'use strict';

angular.module('belissimaApp.directives')
  .directive('blurTo', function() {
    var blur;

    function link(scope, element, attrs, ctrl) {

      element.bind('blur', function(e) {
        window.clearTimeout(blur);
        blur = setTimeout(function() {
          if (scope.$eval(attrs.blurTo)) {
            ctrl.$setViewValue(scope.$eval(attrs.blurTo));
            ctrl.$render();
          }
        }, 100);
      });

    }

    return {
      require: 'ngModel',
      restrict: 'A',
      link: link
    }

  });
