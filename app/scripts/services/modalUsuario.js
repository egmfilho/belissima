/**
 * Created by egmfilho on 05/10/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('ModalUsuario', ['$uibModal', function ($uibModal) {

    return {
      show: function (usuario, perfis, permissoes, descontos) {
        return $uibModal.open({
          animation: true,
          backdrop: false,
          templateUrl: 'partials/modalUsuario.html',
          controller: 'ModalUsuarioCtrl',
          controllerAs: 'modal',
          size: 'md',
          resolve: {
            usuario: function () {
              return usuario;
            },
            perfis: function () {
              return perfis;
            },
            permissoes: function () {
              return permissoes;
            },
            descontos: function() {
              return descontos;
            }
          }
        }).result;
      }
    };

  }]);
