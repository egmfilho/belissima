/**
 * Created by egmfilho on 29/11/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('ModalBuscarTicket', ['$uibModal', function($uibModal) {

    return {
      show: function() {
        return $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalBuscarTicket.html',
          controller: 'ModalBuscarTicketCtrl',
          size: 'md'
        }).result;
      }
    }

  }]);
