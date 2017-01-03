/**
 * Created by egmfilho on 10/08/16.
 */

'use strict';

angular.module('belissimaApp.filters')
  .filter('splitAt', function() {
    return function(value, char) {

      if (!value)
        return '';

      if (!char)
        return value;

      value = value.substring(value.lastIndexOf(char) + 1, value.length);

      return value;
    }
  });
