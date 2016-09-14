/**
 * Created by egmfilho on 13/09/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('ClientesCtrl', [
    '$rootScope',
    '$scope',
    'ProviderPessoa',
    'ProviderTipoContato',
    'ProviderCEP',
    'TipoContato',
    'Endereco',
    'CEP',
    'ContatoPessoa',
    'Pessoa',
    'TiposLogradouros',
    'ModalBuscarEndereco',
    'ModalEditarPessoa',
    function($rootScope, $scope, provider, providerTipoContato, providerCEP, TipoContato, Endereco, CEP, Contato, Pessoa, TiposLogradouros, ModalBuscarEndereco, ModalEditarPessoa) {

      var self = this;

      $scope.$on('$viewContentLoaded', function() {
        $scope.pessoa = new Pessoa();
        $scope.pessoa.enderecos = [ new Endereco() ];
        $scope.pessoa.setEnderecoPrincipal(0);
        $scope.pessoa.contatos = [ new Contato() ];
        $scope.pessoa.setContatoPrincipal(0);

        $scope.tipos_logradouros = TiposLogradouros;

        $scope.tabela = { };
        $scope.tabela.head = [ 'Código', 'Nome', 'Endereço', 'Contato' ];
        $scope.tabela.body = [ ];

        $scope.mascara_tel = '(99) 9999?9-9999';

        getClientes();
        getTiposContato();

        $rootScope.isLoading = false;
      });

      function getClientes() {
        if (!$rootScope.categoriaPessoa) {
          console.log('$rootScope.categoriaPessoa is undefined');
          return;
        }

        $rootScope.isLoading = true;
        provider.obterPessoasPorCategoria($rootScope.categoriaPessoa.cliente, true, true, true, true, true, true, true).then(function(success) {
          $rootScope.isLoading = false;
          angular.forEach(success.data, function(item, index) {
            var pessoa = new Pessoa(Pessoa.converterEmEntrada(item));
            $scope.tabela.body.push({
              codigo: pessoa.codigo,
              nome: pessoa.nome,
              endereco: pessoa.getEnderecoPrincipalEmString(),
              contato: pessoa.getContatoPrincipalEmString()
            });
          });
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

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

      $scope.getMascaraContato = function(id) {
        return $scope.tipos_contatos.find(function(tipo) {
          return tipo.id === id;
        });
      };

      $scope.getCepPorCodigo = function(codigo, $index) {
        $rootScope.isLoading = true;
        providerCEP.obterPorCodigo(codigo, true, true).then(function(success) {
          $rootScope.isLoading = false;
          var ceps = [ ];
          angular.forEach(success.data, function(item, index) {
            ceps.push(new CEP(CEP.converterEmEntrada(item)));
          });
          if (ceps.length > 0) {
            ModalBuscarEndereco.show(ceps, function(result) {
              if (result) $scope.pessoa.enderecos[$index].setCep(result);
            });
          }
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      $scope.addEndereco = function() {
        $scope.pessoa.enderecos.push(new Endereco());
      };

      $scope.removeEndereco = function($index) {
        if ($scope.pessoa.enderecos.length <= 1) {
          $scope.pessoa.enderecos[0] = new Endereco();
          $scope.pessoa.enderecos[0].principal = true;
          return;
        }
        $scope.pessoa.removerEndereco($index);
      };

      $scope.addContato = function() {
        $scope.pessoa.contatos.push(new Contato());
      };

      $scope.removeContato = function($index) {
        if ($scope.pessoa.contatos.length <= 1) {
          $scope.pessoa.contatos[0] = new Contato();
          $scope.pessoa.contatos[0].principal = true;
          return;
        }
        $scope.pessoa.removerContato($index);
      };

      $scope.salvar = function() {
        console.log($scope.pessoa, Pessoa.converterEmSaida($scope.pessoa));

        if (confirm('Tentar a sorte?')) {
          $rootScope.isLoading = true;
          provider.salvarPessoa(Pessoa.converterEmSaida($scope.pessoa)).then(function(success) {
            console.log(success);
            $rootScope.isLoading = false;
            getClientes();
          }, function(error) {
            console.log(error);
            $rootScope.isLoading = false;
          });
        }
      };

      $scope.editar = function(pessoa) {
        $rootScope.isLoading = true;
        if (pessoa) {
          provider.obterPessoaPorCodigo(pessoa.codigo, $rootScope.categoriaPessoa.cliente, true, null, true, true, true, true).then(function(success) {
            $rootScope.isLoading = false;
            ModalEditarPessoa.show(new Pessoa(Pessoa.converterEmEntrada(success.data)), function(result) {
              if (result) {
                console.log(result);
                if (result === 'excluir') {
                  $scope.excluir(pessoa);
                  getClientes();
                }
              }
            });
          }, function(error) {
            console.log(error);
            $rootScope.isLoading = true;
          });
        }
      };

      $scope.excluir = function(pessoa) {
        if (confirm('Excluir pessoa código: ' + pessoa.codigo + '?')) {
          $rootScope.isLoading = true;
          provider.excluirPessoa(pessoa).then(function(success) {
            console.log(success);
            alert('Excluido');
            $rootScope.isLoading = false;
          }, function(error) {
            console.log(error);
            $rootScope.isLoading = false;
          });
        }
      };

    }
  ]);
