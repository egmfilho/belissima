/**
 * Created by egmfilho on 14/09/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('ModalEditarPessoaCtrl', [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'ProviderPessoa',
    'ProviderCategoriaPessoa',
    'ProviderTipoContato',
    'TipoContato',
    'Pessoa',
    'CategoriaPessoa',
    'ModalConfirm',
    'TiposLogradouros',
    'pessoa',
    function($rootScope, $scope, $uibModalInstance, provider, providerCategoriaPessoa, providerTipoContato, TipoContato, Pessoa, CategoriaPessoa, modalConfirm, TiposLogradouros, pessoa) {

      $uibModalInstance.opened.then(function() {
        $scope.pessoa = new Pessoa(pessoa);
        $scope.tipos_logradouros = TiposLogradouros;

        $scope.categorias_pessoa = [ ];
        if ($rootScope.categoriaPessoa) {
          $scope.categorias_pessoa = jQuery.map($rootScope.categoriaPessoa, function(item, index) {
            return [item];
          });
        } else {
          getContatosPessoa();
        }

        getTiposContato();
      });

      function getTiposContato() {
        $scope.tipos_contatos = [ ];
        $rootScope.isLoading = true;
        providerTipoContato.obterTodos().then(function(success) {
          angular.forEach(success.data, function(item, index) {
            $scope.tipos_contatos.push(new TipoContato(TipoContato.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

      function getContatosPessoa() {
        $rootScope.isLoading = true;
        providerCategoriaPessoa.obterTodos().then(function(success) {
          angular.forEach(success.data, function(contato, index) {
            $scope.categorias_pessoa.push(new CategoriaPessoa(CategoriaPessoa.converterEmEntrada(contato)));
          });
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        })
      }

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

      function validar(pessoa) {
        var i;

        if (!pessoa.nome) {
          return false;
        }

        if (!pessoa.categorias.length) {
          return false;
        }

        if (pessoa.tipo === 'F') {
          if (!pessoa.cpf) {
            return false;
          }
        } else {
          if (!pessoa.cnpj) {
            return false;
          }
        }

        for (i = 0; i < pessoa.enderecos.length; i++) {
          if (!pessoa.enderecos[i].cep.codigo || !pessoa.enderecos[i].cep.uf || !pessoa.enderecos[i].cep.cidade.nome || !pessoa.enderecos[i].cep.bairro.nome) {
            return false;
          }

          if (!pessoa.enderecos[i].logradouro) {
            return false;
          }

          if (!pessoa.enderecos[i].numero) {
            return false;
          }
        }

        for (i = 0; i < pessoa.contatos.length; i++) {
          if (!pessoa.contatos[i].tipoId) {
            return false;
          }

          if (!pessoa.contatos[i].contato) {
            return false;
          }
        }

        return true;
      }

      $scope.salvar = function() {
        if (!validar($scope.pessoa)) {
          return;
        }

        //var erros = validar();
        //
        //if (!erros) {
        modalConfirm.show('Aviso', 'Salvar as alterações?', 'Sim', 'Não', function(result) {
          if (result) {
            //providerProduto.atualizarProduto(Produto.converterEmSaida($scope.produto)).then(function(success) {
            //  modalAlert.show('Successo', 'Produto atualizado com sucesso!', 'Ok', function() {
            //    $uibModalInstance.close();
            //  });
            //}, function(error) {
            //  console.log(error);
            //});
            $rootScope.isLoading = true;
            provider.atualizarPessoa($scope.pessoa).then(function(success) {
              console.log(success);
              alert('Atualizado');
              $rootScope.isLoading = false;
            }, function(error) {
              console.log(error);
              $rootScope.isLoading = false;
            });
          } else {

          }
        });
      };

      $scope.excluir = function() {
        modalConfirm.show('Aviso', 'Deseja excluir esta pessoa?', 'Sim', 'Não', function(result) {
          if (result) {
            $uibModalInstance.close('excluir');
          }
        });
      };

      $scope.fechar = function() {
        $uibModalInstance.dismiss('cancel');
      };

    }]);
