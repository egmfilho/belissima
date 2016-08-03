/**
 * Created by egmfilho on 25/07/16.
 */
angular.module('belissimaApp')
  .controller('ModalEventoCtrl', [
    '$scope',
    '$uibModalInstance',
    'ModalConfirm',
    'ProviderTipoEvento',
    'ProviderPessoa',
    'TipoEvento',
    'Pessoa',
    'Evento',
    'evento',
    function($scope, $uibModalInstance, modalConfirm, providerTipo, providerPessoa, TipoEvento, Pessoa, Evento, evento) {

      $scope.evento = { };
      $scope.tipos = [ ];

      if (evento) {
        $scope.evento = new Evento(evento);
        console.log(evento);
      }

      (function getTipos() {
        providerTipo.obterTiposDeEvento().then(function(success) {
          angular.forEach(success.data, function(item, index) {
            $scope.tipos.push(new TipoEvento(TipoEvento.converterEmEntrada(item)));
          });
        }, function(error) {
          console.log(error);
        });
      }());

      function setCliente() {
        if ($scope.evento.clienteId) {
          getPessoa($scope.evento.clienteId).then(function(response) {
            $scope.evento.cliente = response;
          });
        }
      }

      function setFuncionario() {
        if ($scope.evento.funcionarioId) {
          getPessoa($scope.evento.funcionarioId).then(function(response) {
            $scope.evento.funcionario = response;
          });
        }
      }

      function getPessoa(id) {
        return providerPessoa.obterPessoaPorId(id).then(function(success) {
          return new Pessoa(Pessoa.converterEmEntrada(success.data));
        }, function(error) {
          console.log(error);
          return null;
        });
      }

      $scope.selectTipoEvento = function(tipoEvento) {
        $scope.evento.setTipo(tipoEvento);
      };

      $scope.startChanged = function() {
        if ($scope.evento.start >= $scope.evento.end) {
          $scope.evento.end = new Date($scope.evento.start.getTime() + 30 * 60000);
        }
      };

      $scope.endChanged = function() {
        if ($scope.evento.end <= $scope.evento.start) {
          $scope.evento.start = new Date($scope.evento.end.getTime() - 30 * 60000);
        }
      };

      $scope.ok = function() {
        modalConfirm.show('Aviso', 'Salvar as alterações?', 'Sim', 'Não', function(result) {
          if (result) {
            $uibModalInstance.close($scope.evento);
          }
        });
      };

      $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
      };

  }]);
