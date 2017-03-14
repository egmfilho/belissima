/**
 * Created by egmfilho on 14/03/17.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('RelatoriosCtrl', RelatoriosCtrl);

RelatoriosCtrl.$inject = [ '$rootScope' ];

function RelatoriosCtrl($rootScope) {

  this.opcao = 'financeiro';

}
