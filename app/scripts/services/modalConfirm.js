/**
 * Created by egmfilho on 02/08/16.
 */
angular.module('belissimaApp')
  .factory('ModalConfirm', ['$uibModal', function($uibModal) {

    return {
      show: function(title, message, positive, negative, callback) {
        $uibModal.open({
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
        }).result.then(function(result) {
            callback(result);
          });
      }
    }

  }]);