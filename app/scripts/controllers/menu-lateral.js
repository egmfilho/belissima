/**
 * Created by egmfilho on 23/06/16.
 */
'use strict';

angular.module('belissimaApp.controllers')
  .controller('MenuLateralCtrl', ['$rootScope', '$location', 'ModalConfirm', function ($rootScope, $location, modalConfirm) {

    $rootScope.minimizado = true;

    jQuery('#menu-lateral').mouseenter(function () {
      if ($rootScope.minimizado) {
        jQuery(this).find('.seta').stop().fadeTo('slow', .5);
      }
    }).mouseleave(function () {
      jQuery(this).find('.seta').stop().fadeTo('slow', 0);
    });

    function preventers(id) {
      var elem = $(id),
        height = elem.height(),
        scrollHeight = elem.get(0).scrollHeight;

      elem.bind('mousewheel', function (e, d) {
        if ((this.scrollTop <= 0 && e.originalEvent.deltaY < 0) || (this.scrollTop >= (scrollHeight - height) && e.originalEvent.deltaY > 0 )) {
          e.preventDefault();
        }
      });
    }

    preventers('#menu-lateral');
    preventers('#fundo-escuro-menu');

    this.menuRetratil = function () {
      if ($rootScope.minimizado) {
        jQuery('#menu-lateral-conteudo .header .seta').stop().fadeTo('slow', 0);
      }

      $rootScope.minimizado = !$rootScope.minimizado;
    };

    this.logout = function () {
      modalConfirm.show(null, 'Deseja realizar logout do sistem?').then(function() {
        $location.path('/logout');
      });
    };

  }]);
