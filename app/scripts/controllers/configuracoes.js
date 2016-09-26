'use strict';

angular.module('belissimaApp.controllers')
  .controller('ConfiguracoesCtrl', [function() {

    console.log('ConfiguracoesCtrl');

    this.testar = function(msg) {
      console.log(msg);
    };

  }]);
