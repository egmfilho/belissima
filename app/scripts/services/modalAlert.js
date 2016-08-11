/**
 * Created by egmfilho on 08/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .factory('ModalAlert', ['$uibModal', function($uibModal) {

    return {
      show: function(title, message, ok, callback) {
        $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalAlert.html',
          controller: 'ModalAlertCtrl',
          size: 'sm',
          resolve: {
            options: function() {
              return {
                title: title,
                message: message,
                ok: ok
              };
            }
          }
        }).result.then(callback);
      }
    }

  }]);
