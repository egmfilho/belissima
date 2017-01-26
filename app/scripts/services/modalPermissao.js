/**
 * Created by egmfilho on 26/01/17.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('ModalPermissao', ['$uibModal', function($uibModal) {

    return {
      show: function(modulo, permissao) {
        return $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalPermissao.html',
          controller: 'ModalPermissaoCtrl',
          size: 'md',
          ariaDescribedBy: 'modal-permissao',
          resolve: {
            options: function() {
              return {
                modulo: modulo,
                permissao: permissao
              };
            }
          }
        }).result;
      }
    }

  }]);
