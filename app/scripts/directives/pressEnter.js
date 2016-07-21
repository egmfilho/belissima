/**
 * Created by egmfilho on 21/07/16.
 */
'use strict';

angular.module('belissimaApp')
  .directive('pressEnter', ['KEY_CODES', function(keys) {
    return function(scope, element, attrs) {
      element.bind("keypress", function(event) {

        if (event.which === keys.ENTER) {
          //scope.$apply(function() {
          scope.$eval(attrs.pressEnter);
          //});

          event.preventDefault();
        }
      });
    };
  }]);
