/**
 * Created by egmfilho on 25/07/16.
 */

'use strict';

angular.module('belissimaApp')
  .controller('ModalEventoCtrl', [
    '$scope',
    '$uibModalInstance',
    'ModalBuscarPessoa',
    'ModalBuscarProduto',
    'ModalConfirm',
    'ModalAlert',
    'ProviderTipoEvento',
    'ProviderPessoa',
    'ProviderProduto',
    'TipoEvento',
    'Pessoa',
    'Evento',
    'Produto',
    'evento',
    function($scope, $uibModalInstance, modalBuscarPessoa, modalBuscarProduto, modalConfirm, modalAlert, providerTipo, providerPessoa, providerProduto, TipoEvento, Pessoa, Evento, Produto, evento) {

      $scope.evento = { };
      $scope.tipos = [ ];

      $scope.format = 'dd/MM/yy';
      $scope.altInputFormats = ['d!/M!/yy'];

      $scope.dateOptions = {
        formatYear: 'yy',
        minDate: new Date(),
        startingDay: 0,
        showWeeks: false
      };

      if (evento) {
        $scope.evento = new Evento(evento);
      } else {
        $scope.evento = new Evento();
        $scope.evento.start = new Date();
        $scope.evento.end = new Date($scope.evento.start.getTime() + 30 * 60000);
      }

      $scope.data = new Date($scope.evento.start);

      (function getTipos() {
        providerTipo.obterTiposDeEvento().then(function(success) {
          angular.forEach(success.data, function(item, index) {
            $scope.tipos.push(new TipoEvento(TipoEvento.converterEmEntrada(item)));
          });
        }, function(error) {
          console.log(error);
        });
      }());

      $scope.setData = function() {
        if (angular.isDate($scope.data)) {
          var start, end;

          start = $scope.evento.start ? new Date($scope.evento.start) : new Date();
          $scope.evento.start = new Date($scope.data);
          $scope.evento.start.setHours(start.getHours());
          $scope.evento.start.setMinutes(start.getMinutes());

          end = $scope.evento.end ? new Date($scope.evento.end) : new Date();
          $scope.evento.end = new Date($scope.data);
          $scope.evento.end.setHours(end.getHours());
          $scope.evento.end.setMinutes(end.getMinutes());
        }
      };

      $scope.startChanged = function() {
        if (!$scope.evento.start)
          return;

        if ($scope.evento.start >= $scope.evento.end) {
          $scope.evento.end = new Date($scope.evento.start.getTime() + 30 * 60000);
        }
      };

      $scope.endChanged = function() {
        if (!$scope.evento.end)
          return;

        if ($scope.evento.end <= $scope.evento.start) {
          $scope.evento.start = new Date($scope.evento.end.getTime() - 30 * 60000);
        }
      };

      function getPessoaPorCodigo(codigo, categoriaId) {
        return providerPessoa.obterPessoaPorCodigo(codigo, categoriaId, true, true);
      }

      $scope.setPessoa = function(categoriaId) {
        switch (categoriaId) {
          case $scope.categoriaPessoa.cliente:
            getPessoaPorCodigo($scope.evento.cliente.codigo, categoriaId).then(function(success) {
              $scope.evento.setCliente(new Pessoa(Pessoa.converterEmEntrada(success.data)));
            }, function(error) {
              if (error.status == 404) {
                alert('Cliente não encontrado!');
              }
            });
            break;

          case $scope.categoriaPessoa.funcionario:
            getPessoaPorCodigo($scope.evento.funcionario.codigo, categoriaId).then(function(success) {
              $scope.evento.setFuncionario(new Pessoa(Pessoa.converterEmEntrada(success.data)));
            }, function(error) {
              if (error.status == 404) {
                alert('Funcionário não encontrado!');
              }
            });
            break;
        }
      };

      $scope.getPessoa = function(categoria) {
        modalBuscarPessoa.show(categoria, function(result) {
          if (result) {
            if (categoria == $scope.categoriaPessoa.cliente) {
              $scope.evento.setCliente(result);
            } else if (categoria == $scope.categoriaPessoa.funcionario) {
              $scope.evento.setFuncionario(result);
            }
          }
        });
      };

      $scope.removePessoa = function(categoriaId) {
        switch (categoriaId) {
          case $scope.categoriaPessoa.cliente:
            $scope.evento.removeCliente();
            break;

          case $scope.categoriaPessoa.funcionario:
            $scope.evento.removeFuncionario();
            break;
        }
      };

      $scope.setProduto = function() {
        providerProduto.obterProdutoPorCodigo($scope.evento.produto.codigo).then(function(success) {
          $scope.evento.setProduto(new Produto(Produto.converterEmEntrada(success.data)));
        }, function(error) {
          if (error.status == 404) {
            alert('Produto não encontrado!');
          }
        });
      };

      $scope.getProduto = function() {
        modalBuscarProduto.show(function(result) {
          if (result) {
            $scope.evento.setProduto(result);
          }
        });
      };

      $scope.removeProduto = function() {
        $scope.evento.removeProduto();
      };

      $scope.selectTipoEvento = function(tipoEvento) {
        $scope.evento.setTipo(tipoEvento);
      };

      function validar() {
        if (!$scope.evento.title) {
          return 'Digite um título!';
        }

        if (!$scope.data) {
          return 'Verifique a data!';
        }

        if (!$scope.evento.start) {
          return 'Verifique a hora de início!';
        }

        if (!$scope.evento.end) {
          return 'Verifique a hora de término!';
        }

        $scope.setData();

        if (!$scope.evento.tipoId) {
          return 'Selecione um tipo de evento!';
        }

        return null;
      }

      $scope.ok = function() {
        var erros = validar();

        if (!erros) {
          modalConfirm.show('Aviso', 'Salvar as alterações?', 'Sim', 'Não', function(result) {
            if (result) {
              $uibModalInstance.close($scope.evento);
            }
          });
        } else {
          modalAlert.show('Erro', erros, 'Ok');
        }
      };

      $scope.excluir = function() {
        modalConfirm.show('Aviso', 'Deseja excluir o evento?', 'Sim', 'Não', function(result) {
          if (result) {
            $uibModalInstance.close('excluir');
          }
        });
      };

      $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
      };

  }]);
