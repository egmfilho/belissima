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

        if (scope.node.product_group_subgroup) {
          if (scope.node.product_group_subgroup.length > 0) {
            var childNode = $compile('<ul><node-tree ng-model="node.product_group_subgroup"></node-tree></ul>')(scope);
            elem.append(childNode);
          }
        }

        scope.click = function(node, event) {
          event.stopPropagation();

          var children = $(event.currentTarget).find('li');

          if (children.is(':visible')) {
            children.hide('fast');
            $(event.currentTarget).find('span.glyphicon-minus-sign').addClass('glyphicon-plus-sign').removeClass('glyphicon-minus-sign');
          } else {
            children.show('fast');
            $(event.currentTarget).find('span.glyphicon-plus-sign').addClass('glyphicon-minus-sign').removeClass('glyphicon-plus-sign');
          }
        };

        scope.switcher = function(booleanExpr, trueValue, falseValue) {
          return booleanExpr ? trueValue : falseValue;
        };

        scope.isLeaf = function(data) {
          if (data.product_group_subgroup) {
            if (data.product_group_subgroup.length == 0)
              return true;

            return false;
          }

          return true;
        };
      }
    }

  }]);
