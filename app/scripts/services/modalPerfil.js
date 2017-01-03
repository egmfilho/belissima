/**
 * Created by egmfilho on 05/10/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('ModalPerfil', ['$uibModal', function ($uibModal) {

    return {
      show: function (perfil, permissoes) {
        return $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalPerfil.html',
          controller: 'ModalPerfilCtrl',
          controllerAs: 'modal',
          size: 'md',
          resolve: {
            perfil: function () {
              return perfil;
            },
            permissoes: function () {
              return permissoes;
            }
          }
        }).result;
      }
    };

  }]);
