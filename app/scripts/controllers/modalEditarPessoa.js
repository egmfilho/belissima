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
    'Endereco',
    'ContatoPessoa',
    'ModalConfirm',
    'TiposLogradouros',
    'pessoa',
    function($rootScope, $scope, $uibModalInstance, provider, providerCategoriaPessoa, providerTipoContato, TipoContato, Pessoa, CategoriaPessoa, Endereco, Contato, modalConfirm, TiposLogradouros, pessoa) {

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

      $scope.getMascaraContato = function(id) {
        return $scope.tipos_contatos.find(function(tipo) {
          return tipo.id === id;
        });
      };

      $scope.addEndereco = function() {
        $scope.pessoa.enderecos.push(new Endereco());
        if ($scope.pessoa.enderecos.length === 1) {
          $scope.pessoa.setEnderecoPrincipal(0);
        }
      };

      $scope.removeEndereco = function($index) {
        if ($scope.pessoa.enderecos.length <= 0) {
          $scope.pessoa.enderecos[0] = new Endereco();
          $scope.pessoa.enderecos[0].principal = true;
          return;
        }
        $scope.pessoa.removerEndereco($index);
      };

      $scope.addContato = function() {
        $scope.pessoa.contatos.push(new Contato());
        if ($scope.pessoa.contatos.length === 1) {
          $scope.pessoa.setContatoPrincipal(0);
        }
      };

      $scope.removeContato = function($index) {
        if ($scope.pessoa.contatos.length <= 0) {
          $scope.pessoa.contatos[0] = new Contato();
          $scope.pessoa.contatos[0].principal = true;
          return;
        }
        $scope.pessoa.removerContato($index);
      };

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
            provider.atualizarPessoa(Pessoa.converterEmSaida($scope.pessoa)).then(function(success) {
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
