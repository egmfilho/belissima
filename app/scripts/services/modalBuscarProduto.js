/**
 * Created by egmfilho on 08/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .factory('ModalBuscarProduto', ['$uibModal', function($uibModal) {

    return {
      show: function(callback) {
        $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalBuscarProduto.html',
          controller: 'ModalBuscarProdutoCtrl',
          size: 'lg'
        }).result.then(function(result) {
            callback(result);
          }, function() {
            callback(null);
          });
      }
    }

  }]);
