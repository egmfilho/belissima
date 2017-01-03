/**
 * Created by egmfilho on 10/08/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('ModalGrupo', ['$uibModal', function($uibModal) {

    return {
      show: function(callback) {
        $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalGrupo.html',
          controller: 'ModalGrupoCtrl',
          size: 'md'
        }).result.then(function(result) {
            callback(result);
          }, function() {
            callback(null);
          });
      }
    }

  }]);
