/**
 * Created by egmfilho on 23/06/16.
 */
'use strict';

angular.module('belissimaApp.controllers')
  .controller('MenuLateralCtrl', ['$rootScope', function ($rootScope) {

    $rootScope.minimizado = false;

    function preventers(id) {
      var elem = $(id),
          height = elem.height(),
          scrollHeight = elem.get(0).scrollHeight;

      elem.bind('mousewheel', function(e, d) {
        if ((this.scrollTop <= 0 && e.originalEvent.deltaY < 0) || (this.scrollTop >= (scrollHeight - height) && e.originalEvent.deltaY > 0 )) {
          e.preventDefault();
        }
      });
    }

    preventers('#menu-lateral');
    preventers('#fundo-escuro-menu');

    this.menuRetratil = function() {
      $rootScope.minimizado = !$rootScope.minimizado;
    };

  }]);
