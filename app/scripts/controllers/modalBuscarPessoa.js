/**
 * Created by egmfilho on 03/08/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('ModalBuscarPessoaCtrl', [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'ProviderPessoa',
    'Pessoa',
    'categoriaId',
    function($rootScope, $scope, $uibModalInstance, provider, Pessoa, categoriaId) {

      $uibModalInstance.opened.then(function() {
        $rootScope.loading.unload();
        $scope.resultado = [ ];
        //setTimeout(function() {
        //  var windowH = parseInt(jQuery(window).height()),
        //      header = parseInt(jQuery('.meu-modal .header').height()),
        //      subHeader = parseInt(jQuery('.meu-modal .sub-header').height()),
        //      control = parseInt(jQuery('.meu-modal .control').height());
        //  console.log('body', jQuery('.meu-modal .body').height());
        //  console.log('window', windowH);
        //  console.log('header', header);
        //  console.log('subheader', subHeader);
        //  console.log('control', control);
        //  jQuery('.meu-modal .body').css('background-color', 'red').height(windowH - header - subHeader - control);
        //  console.log('body', jQuery('.meu-modal .body').height());
        //}, 1500);
      });

      function setResultado(resultado) {
        $scope.resultado = [ ];

        if (angular.isArray(resultado)) {
          angular.forEach(resultado, function(item, index) {
            $scope.resultado.push(new Pessoa(Pessoa.converterEmEntrada(item)));
          });
        } else {
          $scope.resultado.push(new Pessoa(Pessoa.converterEmEntrada(resultado)));
          console.log($scope.resultado);
        }
      }

      $scope.getPessoaPorCodigo = function(codigo) {
        $rootScope.loading.load();
        provider.obterPessoaPorCodigo(codigo, true, true, true, true, true, true, true, categoriaId).then(function(success) {
          setResultado(success.data);
          $rootScope.loading.unload();
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      };

      $scope.getPessoaPorDocumento = function(documento) {
        $rootScope.loading.load();
        provider.obterPessoasPorDocumento(documento, true, true, true, true, true, true, true, categoriaId).then(function(success) {
          setResultado(success.data);
          $rootScope.loading.unload();
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      };

      $scope.getPessoasPorNome = function(nome) {
        $rootScope.loading.load();
        provider.obterPessoasPorNome(nome, true, true, true, true, true, true, true, categoriaId).then(function(success) {
          setResultado(success.data);
          $rootScope.loading.unload();
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      };

      $scope.selecionarPessoa = function(pessoa) {
        $uibModalInstance.close(pessoa);
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };

    }]);
