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
    'ModalConfirm',
    function ($rootScope, $scope, providerCidade, Cidade, providerBairro, Bairro, providerCEP, CEP, modalConfirm) {

      var self = this;

      self.cidade = new Cidade();
      self.bairro = new Bairro();
      self.cep = new CEP();

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
        $rootScope.loading.load();
        self.cidades = [];
        providerCidade.obterTodos((self.paginationCidade.current - 1) * self.paginationCidade.max + ',' + self.paginationCidade.max).then(function (success) {
          self.paginationCidade.total = success.info.quantity;
          angular.forEach(success.data, function (item, index) {
            self.cidades.push(new Cidade(Cidade.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getBairros() {
        $rootScope.loading.load();
        self.bairros = [];
        providerBairro.obterTodos((self.paginationBairro.current - 1) * self.paginationBairro.max + ',' + self.paginationBairro.max).then(function (success) {
          self.paginationBairro.total = success.info.quantity;
          angular.forEach(success.data, function (item, index) {
            self.bairros.push(new Bairro(Bairro.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getCEPs() {
        $rootScope.loading.load();
        self.ceps = [];
        providerCEP.obterTodos(true, true, (self.paginationCEP.current - 1) * self.paginationCEP.max + ',' + self.paginationCEP.max).then(function (success) {
          self.paginationCEP.total = success.info.quantity;
          angular.forEach(success.data, function (item, index) {
            self.ceps.push(new CEP(CEP.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      getCidades();
      getBairros();
      getCEPs();

      self.atualizarCidades = getCidades;
      self.atualizarBairros = getBairros;
      self.atualizarCEPs = getCEPs;

      self.cancelarModalCidade = function() {
        jQuery('#modalCidade').modal('hide');
        self.cidade = new Cidade();
      };

      self.cancelarModalBairro = function() {
        jQuery('#modalBairro').modal('hide');
        self.bairro = new Bairro();
      };

      self.cancelarModalCEP = function() {
        jQuery('#modalCEP').modal('hide');
        self.cep = new CEP();
      };

      self.getCidadePorCodigo = function (codigo) {
        $rootScope.loading.load();
        return providerCidade.obterPorCodigo(codigo).then(function (success) {
          $rootScope.loading.unload();
          self.cep.setCidade(new Cidade(Cidade.converterEmEntrada(success.data)));
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      };

      self.getBairroPorCodigo = function (codigo) {
        $rootScope.loading.load();
        providerBairro.obterPorCodigo(codigo).then(function (success) {
          $rootScope.loading.unload();
          self.cep.setBairro(new Bairro(Bairro.converterEmEntrada(success.data)));
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      };

      self.salvarCidade = function () {
        if (!self.cidade.nome) {
          $rootScope.alerta.show('Insira o nome da Cidade!', 'alert-danger');
          return;
        } else if (!self.cidade.uf) {
          $rootScope.alerta.show('Selecione uma UF!', 'alert-danger');
          return;
        }

        console.log(Cidade.converterEmSaida(self.cidade));

        $rootScope.loading.load();

        if (!self.cidade.id) {
          providerCidade.adicionar(Cidade.converterEmSaida(self.cidade)).then(function (success) {
            jQuery('#modalCidade').modal('hide');
            self.cidade = new Cidade();
            self.atualizarCidades();
            $rootScope.loading.unload();
            $rootScope.alerta.show('Cidade adicionada!', 'alert-success');
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
          });
        } else {
          providerCidade.editar(Cidade.converterEmSaida(self.cidade)).then(function (success) {
            jQuery('#modalCidade').modal('hide');
            self.cidade = new Cidade();
            self.atualizarCidades();
            $rootScope.loading.unload();
            $rootScope.alerta.show('Cidade editada!', 'alert-success');
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
          });
        }
      };

      self.salvarBairro = function () {
        if (!self.bairro.nome) {
          $rootScope.alerta.show('Insira o nome do Bairro!', 'alert-danger');
          return;
        }

        console.log(Bairro.converterEmSaida(self.bairro));

        $rootScope.loading.load();
        if (!self.bairro.id) {
          providerBairro.adicionar(Bairro.converterEmSaida(self.bairro)).then(function (success) {
            jQuery('#modalBairro').modal('hide');
            self.bairro = new Bairro();
            self.atualizarBairros();
            $rootScope.loading.unload();
            $rootScope.alerta.show('Bairro adicionado!', 'alert-success');
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
          });
        } else {
          providerBairro.editar(Bairro.converterEmSaida(self.bairro)).then(function (success) {
            jQuery('#modalBairro').modal('hide');
            self.bairro = new Bairro();
            self.atualizarBairros();
            $rootScope.loading.unload();
            $rootScope.alerta.show('Bairro editado!', 'alert-success');
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
          });
        }
      };

      self.salvarCEP = function () {

        if (!self.cep.cidade.id) {
          $rootScope.alerta.show('Escolha uma cidade!', 'alert-danger');
          return false;
        }

        if (!self.cep.bairro.id) {
          $rootScope.alerta.show('Escolha um bairro!', 'alert-danger');
          return false;
        }

        console.log(CEP.converterEmSaida(self.cep));

        $rootScope.loading.load();
        if (!self.cep.id) {
          providerCEP.adicionar(CEP.converterEmSaida(self.cep)).then(function (success) {
            jQuery('#modalCEP').modal('hide');
            self.cep = new CEP();
            self.atualizarCEPs();
            $rootScope.loading.unload();
            $rootScope.alerta.show('CEP adicionado!', 'alert-success');
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
          });
        } else {
          providerCEP.editar(CEP.converterEmSaida(self.cep)).then(function (success) {
            jQuery('#modalCEP').modal('hide');
            self.cep = new CEP();
            self.atualizarCEPs();
            $rootScope.loading.unload();
            $rootScope.alerta.show('CEP atualizado!', 'alert-success');
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
          });
        }

      };

      self.editarCidade = function (cidade) {
        self.cidade = new Cidade(cidade);
        jQuery('#modalCidade').modal('show');
      };

      self.editarBairro = function (bairro) {
        self.bairro = new Bairro(bairro);
        jQuery('#modalBairro').modal('show');
      };

      self.editarCEP = function (cep) {
        self.cep = new CEP(cep);
        jQuery('#modalCEP').modal('show');
      };

      self.excluirCidade = function (cidade) {
        modalConfirm.show(null, 'Deseja excluir a cidade "' + cidade.nome + '"?').then(function() {
          $rootScope.loading.load();
          providerCidade.remover(cidade.id).then(function (success) {
            self.atualizarCidades();
            $rootScope.loading.unload();
            $rootScope.alerta.show('Cidade removida!', 'alert-success');
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
          });
        })
      };

      self.excluirBairro = function (bairro) {
        modalConfirm.show(null, 'Deseja excluir o bairro "' + bairro.nome + '"?').then(function() {
          $rootScope.loading.load();
          providerBairro.remover(bairro.id).then(function (success) {
            self.atualizarBairros();
            $rootScope.loading.unload();
            $rootScope.alerta.show('Bairro removido!', 'alert-success');
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
          });
        });
      };

      self.excluirCEP = function (cep) {
        modalConfirm.show(null, 'Deseja excluir o CEP "' + cep.codigo + '"?').then(function() {
          $rootScope.loading.load();
          providerCEP.remover(cep.id).then(function (success) {
            self.atualizarCEPs();
            $rootScope.loading.unload();
            $rootScope.alerta.show('CEP removido!', 'alert-success');
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
          });
        });
      };

    }]);
