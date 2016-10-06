/**
 * Created by egmfilho on 06/10/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('EnderecosCtrl', [
    '$rootScope',
    '$scope',
    'ProviderCidade',
    'Cidade',
    'ProviderBairro',
    'Bairro',
    'ProviderCEP',
    'CEP',
    function ($rootScope, $scope, providerCidade, Cidade, providerBairro, Bairro, providerCEP, CEP) {

      var self = this;

      self.paginationCidade = {
        current: 1,
        max: 15,
        total: 0,
        pageChanged: function () {
          getCidades();
        }
      };

      self.paginationBairro = {
        current: 1,
        max: 15,
        total: 0,
        pageChanged: function () {
          getBairros();
        }
      };

      self.paginationCEP = {
        current: 1,
        max: 15,
        total: 0,
        pageChanged: function () {
          getCEPs();
        }
      };

      function getCidades() {
        $rootScope.isLoading = true;
        self.cidades = [];
        providerCidade.obterTodos((self.paginationCidade.current - 1) * self.paginationCidade.max + ',' + self.paginationCidade.max).then(function (success) {
          self.paginationCidade.total = success.info.quantity;
          angular.forEach(success.data, function (item, index) {
            self.cidades.push(new Cidade(Cidade.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

      function getBairros() {
        $rootScope.isLoading = true;
        self.bairros = [];
        providerBairro.obterTodos((self.paginationBairro.current - 1) * self.paginationBairro.max + ',' + self.paginationBairro.max).then(function (success) {
          self.paginationBairro.total = success.info.quantity;
          angular.forEach(success.data, function (item, index) {
            self.bairros.push(new Bairro(Bairro.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

      function getCEPs() {
        $rootScope.isLoading = true;
        self.ceps = [];
        providerCEP.obterTodos(true, true, (self.paginationCEP.current - 1) * self.paginationCEP.max + ',' + self.paginationCEP.max).then(function (success) {
          self.paginationCEP.total = success.info.quantity;
          angular.forEach(success.data, function (item, index) {
            self.ceps.push(new CEP(CEP.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

      getCidades();
      getBairros();
      getCEPs();

      self.atualizarCidades = getCidades;
      self.atualizarBairros = getBairros;
      self.atualizarCEPs = getCEPs;

    }]);
