/**
 * Created by egmfilho on 25/07/16.
 */
angular.module('belissimaApp')
  .controller('ModalEventoCtrl', [
    '$scope',
    '$uibModalInstance',
    'ModalBuscarPessoa',
    'ModalConfirm',
    'ProviderTipoEvento',
    'ProviderPessoa',
    'TipoEvento',
    'Pessoa',
    'Evento',
    'evento',
    function($scope, $uibModalInstance, modalBuscarPessoa, modalConfirm, providerTipo, providerPessoa, TipoEvento, Pessoa, Evento, evento) {

      $scope.evento = { };
      $scope.tipos = [ ];

      if (evento) {
        $scope.evento = new Evento(evento);
      } else {
        $scope.evento = new Evento();
        $scope.evento.start = new Date();
        $scope.evento.end = new Date();
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

      function getPessoaPorCodigo(codigo, categoriaId) {
        return providerPessoa.obterPessoaPorCodigo(codigo, categoriaId, true, true);
      }

      $scope.setPessoa = function(categoriaId) {
        switch (categoriaId) {
          case $scope.categoriaPessoa.cliente:
            getPessoaPorCodigo($scope.evento.cliente.codigo, categoriaId).then(function(success) {
              $scope.evento.setCliente(new Pessoa(Pessoa.converterEmEntrada(success.data)));
            }, function(error) {
              console.log(error);
            });
            break;

          case $scope.categoriaPessoa.funcionario:
            getPessoaPorCodigo($scope.evento.funcionario.codigo, categoriaId).then(function(success) {
              $scope.evento.setFuncionario(new Pessoa(Pessoa.converterEmEntrada(success.data)));
            }, function(error) {
              console.log(error);
            });
            break;
        }
      };

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
