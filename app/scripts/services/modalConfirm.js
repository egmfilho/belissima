/**
 * Created by egmfilho on 02/08/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('ModalConfirm', ['$uibModal', function($uibModal) {

    return {
      show: function(title, message, positive, negative) {
        return $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalConfirm.html',
          controller: 'ModalConfirmCtrl',
          size: 'sm',
          resolve: {
            options: function() {
              return {
                title: title,
                message: message,
                positive: positive,
                negative: negative
              };
            }
          }
        }).result;
      }
    }

  }]);
