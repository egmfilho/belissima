/**
 * Created by egmfilho on 10/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .directive('nodeTree', function() {
    return {
      template: '<node ng-repeat="node in tree"></node>',
      replace: true,
      transclude: true,
      restrict: 'E',
      scope: {
        tree: '=ngModel'
      }
    }
  });
