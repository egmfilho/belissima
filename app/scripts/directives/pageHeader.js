/**
 * Created by egmfilho on 19/07/16.
 */
'use strict';

angular.module('belissimaApp')
  .directive('pageHeader', [function() {
    return {
      restrict: 'E',
      scope: {
        icon: '@',
        titulo: '@',
        subtitulo: '@'
      },
      templateUrl: 'partials/pageHeader.html'
    };
  }]);
