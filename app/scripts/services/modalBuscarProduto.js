/**
 * Created by egmfilho on 08/08/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('ModalBuscarProduto', ['$uibModal', function($uibModal) {

    return {
      show: function(callback) {
        return $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalBuscarProduto.html',
          controller: 'ModalBuscarProdutoCtrl',
          size: 'lg'
        }).result;
      }
    }

  }]);
