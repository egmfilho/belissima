/**
 * Created by egmfilho on 25/07/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('ModalEventoCtrl', [
    '$rootScope',
    '$scope',
    '$timeout',
    '$uibModalInstance',
    'ModalBuscarPessoa',
    'ModalBuscarProduto',
    'ModalConfirm',
    'ModalAlert',
    'ProviderEvento',
    'ProviderTipoEvento',
    'ProviderPessoa',
    'ProviderProduto',
    'TipoEvento',
    'Pessoa',
    'Evento',
    'Produto',
    'evento',
    'data',
    function ($rootScope, $scope, $timeout, $uibModalInstance, modalBuscarPessoa, modalBuscarProduto, modalConfirm, modalAlert, providerEvento, providerTipo, providerPessoa, providerProduto, TipoEvento, Pessoa, Evento, Produto, evento, data) {

      var results = [];

      $uibModalInstance.opened.then(function () {

        if (evento) {
          $scope.evento = new Evento(evento);
        } else {
          $scope.evento = new Evento();
          $scope.evento.start = new Date();
          if (data) {
            $scope.evento.start.setYear(data.getFullYear());
            $scope.evento.start.setMonth(data.getMonth());
            $scope.evento.start.setDate(data.getDate());
          }
          $scope.evento.end = new Date($scope.evento.start.getTime() + 30 * 60000);
          $scope.evento.start.setSeconds(1);
          $scope.evento.end.setSeconds(0);
        }

        $scope.tipos = [];

        $scope.data = new Date($scope.evento.start);

        $scope.format = 'dd/MM/yy';
        $scope.altInputFormats = ['d!/M!/yy'];

        $scope.dateOptions = {
          formatYear: 'yy',
          minDate: new Date(),
          startingDay: 0,
          showWeeks: false
        };

        getTipos();
        $rootScope.loading.unload();
      });

      function getTipos() {
        $rootScope.loading.load();
        providerTipo.obterTiposDeEvento().then(function (success) {
          angular.forEach(success.data, function (item, index) {
            $scope.tipos.push(new TipoEvento(TipoEvento.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      $scope.setData = function () {
        if (angular.isDate($scope.data)) {
          var start, end;

          start = $scope.evento.start ? new Date($scope.evento.start) : new Date();
          $scope.evento.start = new Date($scope.data);
          $scope.evento.start.setHours(start.getHours());
          $scope.evento.start.setMinutes(start.getMinutes());
          $scope.evento.start.setSeconds(0);

          end = $scope.evento.end ? new Date($scope.evento.end) : new Date();
          $scope.evento.end = new Date($scope.data);
          $scope.evento.end.setHours(end.getHours());
          $scope.evento.end.setMinutes(end.getMinutes());
          $scope.evento.end.setSeconds(0);
        }
      };

      $scope.startChanged = function () {
        if (!$scope.evento.start)
          return;

        $timeout(function () {
          if ($scope.evento.start >= $scope.evento.end) {
            $scope.evento.end = new Date($scope.evento.start.getTime() + 30 * 60000);
          }
        }, 1000);
      };

      $scope.endChanged = function () {
        if (!$scope.evento.end)
          return;

        $timeout(function () {
          if ($scope.evento.end <= $scope.evento.start) {
            $scope.evento.start = new Date($scope.evento.end.getTime() - 30 * 60000);
          }
        }, 1000);
      };

      function getPessoaPorCodigo(codigo, categoriaId) {
        return providerPessoa.obterPessoaPorCodigo(codigo, categoriaId, true, true);
      }

      $scope.setPessoa = function (categoriaId) {
        switch (categoriaId) {
          case $scope.categoriaPessoa.cliente.id:
            $rootScope.loading.load();
            getPessoaPorCodigo($scope.evento.cliente.codigo, categoriaId).then(function (success) {
              $scope.evento.setCliente(new Pessoa(Pessoa.converterEmEntrada(success.data)));
              $rootScope.loading.unload();
            }, function (error) {
              if (error.status == 404) {
                $rootScope.loading.unload();
                $rootScope.alerta.show('Cliente não encontrado');
              }
            });
            break;

          case $scope.categoriaPessoa.funcionario.id:
            $rootScope.loading.load();
            getPessoaPorCodigo($scope.evento.funcionario.codigo, categoriaId).then(function (success) {
              $scope.evento.setFuncionario(new Pessoa(Pessoa.converterEmEntrada(success.data)));
              $rootScope.loading.unload();
            }, function (error) {
              if (error.status == 404) {
                $rootScope.loading.unload();
                $rootScope.alerta.show('Aviso', 'Funcionário não encontrado');
              }
            });
            break;
        }
      };

      $scope.getPessoa = function (categoriaId) {
        modalBuscarPessoa.show(categoriaId).then(function (result) {
          if (result) {
            if (categoriaId == $scope.categoriaPessoa.cliente.id) {
              $scope.evento.setCliente(result);
            } else if (categoriaId == $scope.categoriaPessoa.funcionario.id) {
              $scope.evento.setFuncionario(result);
            }
          }
        });
      };

      $scope.removePessoa = function (categoriaId) {
        switch (categoriaId) {
          case $scope.categoriaPessoa.cliente:
            $scope.evento.removeCliente();
            break;

          case $scope.categoriaPessoa.funcionario:
            $scope.evento.removeFuncionario();
            break;
        }
      };

      $scope.setProduto = function () {
        providerProduto.obterProdutoPorCodigo($scope.evento.produto.codigo).then(function (success) {
          $scope.evento.setProduto(new Produto(Produto.converterEmEntrada(success.data)));
        }, function (error) {
          if (error.status == 404) {
            modalAlert.show('Aviso', 'Produto não encontrado');
          }
        });
      };

      $scope.getProduto = function () {
        modalBuscarProduto.show().then(function (result) {
          if (result) {
            $scope.evento.setProduto(result);
          }
        });
      };

      $scope.removeProduto = function () {
        $scope.evento.removeProduto();
      };

      $scope.selectTipoEvento = function (tipoEvento) {
        $scope.evento.setTipo(tipoEvento);
      };

      function validar() {
        if (!$scope.evento.title) {
          $rootScope.alerta.show('Digite um título!', 'alert-danger');
          return false;
        }

        if (!$scope.data) {
          $rootScope.alerta.show('Verifique a data!', 'alert-danger');
          return false;
        }

        if (!$scope.evento.start) {
          $rootScope.alerta.show('Verifique a hora de início!', 'alert-danger');
          return false;
        }

        if (!$scope.evento.end) {
          $rootScope.alerta.show('Verifique a hora de término!', 'alert-danger');
          return false;
        }

        $scope.setData();

        if (!$scope.evento.tipoId) {
          $rootScope.alerta.show('Selecione um tipo de evento!', 'alert-danger');
          return false;
        }

        return true;
      }

      $scope.ok = function () {
        if (!validar()) {
          return;
        }

        modalConfirm.show('Aviso', 'Salvar as alterações?', 'Sim', 'Não').then(function () {
          $rootScope.loading.load();
          if ($scope.evento.id) {
            providerEvento.atualizarEvento(Evento.converterEmSaida($scope.evento)).then(function (success) {
              results.push(new Evento($scope.evento));
              $rootScope.loading.unload();
              modalConfirm.show('Aviso', 'Continuar agendando para este cliente?', 'Sim', 'Não').then(function() {
                var temp = new Evento($scope.evento);
                $scope.evento = new Evento();
                $scope.evento.setCliente(temp.cliente);
                $scope.evento.start = new Date(temp.end);
                $scope.evento.end = new Date($scope.evento.start.getTime() + 30 * 60000);
                $scope.evento.start.setSeconds(1);
                $scope.evento.end.setSeconds(0);
              }, function() {
                $uibModalInstance.close(results);
              });
            }, function (error) {
              console.log(error);
              $rootScope.loading.unload();
            });
          } else {
            providerEvento.salvarEvento(Evento.converterEmSaida($scope.evento)).then(function (success) {
              results.push(new Evento($scope.evento));
              $rootScope.loading.unload();
              modalConfirm.show('Aviso', 'Continuar agendando para este cliente?', 'Sim', 'Não').then(function() {
                var temp = new Evento($scope.evento);
                $scope.evento = new Evento();
                $scope.evento.setCliente(temp.cliente);
                $scope.evento.start = new Date(temp.end);
                $scope.evento.end = new Date($scope.evento.start.getTime() + 30 * 60000);
                $scope.evento.start.setSeconds(1);
                $scope.evento.end.setSeconds(0);
              }, function() {
                $uibModalInstance.close(results);
              });
            }, function (error) {
              console.log(error);
              $rootScope.loading.unload();
            });
          }
        });
      };

      $scope.excluir = function () {
        modalConfirm.show('Aviso', 'Deseja excluir o evento?', 'Sim', 'Não').then(function () {
          $uibModalInstance.close('excluir');
        });
      };

      $scope.close = function () {
        $uibModalInstance.close(results);
      };

    }]);
