/**
 * Created by egmfilho on 10/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .directive('node', ['$compile', function($compile) {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'partials/tree.html',
      link: function(scope, elem, attrs) {

        scope.callback = function(node) {
          scope.$parent.callback({ node: node });
        };

        if (scope.node.subgrupo) {
          if (scope.node.subgrupo.length > 0) {
            var childNode = $compile('<ul><node-tree ng-model="node.subgrupo" callback="callback(node)"></node-tree></ul>')(scope);
            elem.append(childNode);
          }
        }

        scope.click = function(node, event) {
          event.stopPropagation();

          var children = $(event.currentTarget.parentElement).find('li');

          if (scope.isLeaf(node)) {
            scope.$parent.callback({ node: node });
          } else {
            if (children.is(':visible')) {
              children.hide('fast');
              $(event.currentTarget.parentElement).find('span.glyphicon-minus-sign').addClass('glyphicon-plus-sign').removeClass('glyphicon-minus-sign');
            } else {
              children.show('fast');
              $(event.currentTarget.parentElement).find('span.glyphicon-plus-sign').addClass('glyphicon-minus-sign').removeClass('glyphicon-plus-sign');
            }
          }
        };

        scope.switcher = function(booleanExpr, trueValue, falseValue) {
          return booleanExpr ? trueValue : falseValue;
        };

        scope.isLeaf = function(data) {
          if (!data) return false;

          if (data.subgrupo) {
            if (data.subgrupo.length == 0) return true;

            return false;
          }

          return true;
        };
      }
    }

  }]);
