'use strict';

angular.module('belissimaApp.controllers')
  .controller('ConfiguracoesCtrl', ['$filter', function($filter) {

    console.log('ConfiguracoesCtrl');

    this.testar = function(msg) {
      console.log(msg);
    };

    this.model = 222333.22;
    this.model2 = 222333.22;

  }]);
