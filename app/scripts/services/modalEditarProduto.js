/**
 * Created by egmfilho on 11/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .factory('ModalEditarProduto', ['$uibModal', function($uibModal) {

    return {
      show: function(produto, callback) {
        $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalEditarProduto.html',
          controller: 'ModalEditarProdutoCtrl',
          size: 'lg',
          resolve: {
            produto: function() {
              return produto;
            }
          }
        }).result.then(function(result) {
            callback(result);
          }, function() {
            callback(null);
          });
      }
    }

  }]);
