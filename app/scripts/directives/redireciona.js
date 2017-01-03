/**
 * Created by egmfilho on 21/06/16.
 */

'use strict';

angular.module('belissimaApp.directives')
    .directive('redireciona', ['$rootScope', '$location', function($rootScope, $location) {

    return function(scope, element, attrs) {
      var path;

      attrs.$observe('redireciona', function(val) {
        path = val;
      });

      element.bind('click', function() {
        scope.$apply(function() {
          $rootScope.minimizado = true;
          $location.path(path);
        });
      });
    };

  }]);
