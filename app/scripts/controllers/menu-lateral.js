/**
 * Created by egmfilho on 23/06/16.
 */
'use strict';

angular.module('belissimaApp')
  .controller('MenuLateralCtrl', ['$rootScope', function ($rootScope) {

    $rootScope.minimizado = false;

    this.menuRetratil = function() {
      angular.element('#menu-lateral').css('left', $rootScope.minimizado ? 0 : -236);
      angular.element('#menu-lateral-conteudo .logotipo').css('opacity', $rootScope.minimizado ? 1.0 : 0);
      //angular.element('body').css('margin-left', $scope.minimizado ? 300 : 64);
      $rootScope.minimizado = !$rootScope.minimizado;
    };

  }]);
