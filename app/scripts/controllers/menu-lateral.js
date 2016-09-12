/**
 * Created by egmfilho on 23/06/16.
 */
'use strict';

angular.module('belissimaApp.controllers')
  .controller('MenuLateralCtrl', ['$rootScope', function ($rootScope) {

    $rootScope.minimizado = false;

    this.menuRetratil = function() {
      angular.element('#menu-lateral').css('left', $rootScope.minimizado ? 0 : -236);
      angular.element('#menu-lateral-conteudo .logotipo').css('opacity', $rootScope.minimizado ? 1.0 : 0);
      angular.element('.dark-div').toggleClass('show-dark-div');
      $rootScope.minimizado = !$rootScope.minimizado;
    };

  }]);
