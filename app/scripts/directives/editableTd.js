/**
 * Created by egmfilho on 07/11/16.
 */

'use strict';

angular.module('belissimaApp.directives')
  .directive('editableTd', ['KEY_CODES', function(keys) {

    function link(scope, element, attrs) {
      element.on('click', function() {
        jQuery(element).addClass('ativo').find('input').focus().select();
      });

      element.on('focusout', function() {
        jQuery(element).removeClass('ativo');
      });

      element.on('keydown', function(event) {
        if (event.keyCode === keys.ENTER || event.keyCode === keys.ESCAPE) {
          jQuery(element).addClass('ativo').find('input').focusout();
          event.preventDefault();
        }
      });
    }

    return {
      restrict: 'A',
      link: link
    }

  }]);
