/**
 * Created by egmfilho on 05/12/16.
 */

'use strict';

angular.module('belissimaApp.directives')
  .filter('zpad', function() {
    return function(input, n) {
      if(input === undefined)
        input = "";
      if(input.length >= n)
        return input;
      var zeros = "0".repeat(n);
      return (zeros + input).slice(-1 * n)
    };
  });
