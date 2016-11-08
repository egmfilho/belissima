/**
 * Created by egmfilho on 08/11/16.
 */

'use strict';

angular.module('belissimaApp.directives')
.directive('confirmPopup', function() {

  function link(scope, element, attrs) {
    var html =
      '<div class="clearfix">' +
        scope.message +
        '<br><br>' +
        '<button class="btn btn-default pull-left" name="ok"><span class="glyphicon glyphicon-ok"></span> Sim</button>' +
        '<button class="btn btn-default pull-right" name="cancel"><span class="glyphicon glyphicon-remove"></span> Não</button>' +
      '</div>';

    element.popover({
      html: true,
      content: html,
      trigger: 'focus',
      title: scope.title,
      placement: scope.placement || 'top'
    });

    element.bind('click', function(e) {
      e.stopPropagation();

      jQuery('.popover button[name="ok"]').click(function(e) {
        scope.okFunc();
        scope.$apply();
      });

      jQuery('.popover button[name="cancel"]').click(function(e) {
        scope.cancelFunc();
        scope.$apply();
      });
    });
  }

  return {
    restrict: 'A',
    scope: {
      title: '@',
      message: '@',
      placement: '@',
      okFunc: '&',
      cancelFunc: '&'
    },
    link: link
  }
});
