/**
 * Created by egmfilho on 23/06/16.
 */
'use strict';

angular.module('belissimaApp')
  .controller('MenuLateralCtrl', ['$scope', function ($scope) {

    $scope.minimizado = false;

    $scope.menuRetratil = function() {
      angular.element('#menu-lateral').css('left', $scope.minimizado ? 0 : -236);
      angular.element('#menu-lateral-conteudo .logotipo').css('opacity', $scope.minimizado ? 1.0 : 0);
      angular.element('body').css('margin-left', $scope.minimizado ? 300 : 64);
      $scope.minimizado = !$scope.minimizado;
    };

  }]);
