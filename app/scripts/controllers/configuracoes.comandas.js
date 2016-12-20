/**
 * Created by egmfilho on 20/12/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('ComandasCtrl', ComandasCtrl);

ComandasCtrl.$inject = [ '$rootScope', '$scope' ];

function ComandasCtrl($rootScope, $scope) {

  this.abrirModal = function() {
    jQuery('#modalComanda').modal('show');
  }

}
