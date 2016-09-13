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
    'ContatoPessoa',
    'Pessoa',
    'TiposLogradouros',
    function($rootScope, $scope, provider, providerTipoContato, providerCEP, TipoContato, Endereco, Contato, Pessoa, TiposLogradouros) {

      $scope.$on('$viewContentLoaded', function() {
        $scope.pessoa = new Pessoa();
        $scope.pessoa.enderecos = [ new Endereco() ];
        $scope.pessoa.contatos = [ new Contato() ];

        $scope.tipos_logradouros = TiposLogradouros;

        $scope.tabela = { };
        $scope.tabela.head = [ 'Código', 'Nome', 'Endereço', 'Contato' ];
        $scope.tabela.body = [ ];

        getClientes();
        getTiposContatos();
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

      function getTiposContatos() {
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

      $scope.getCepPorCodigo = function(codigo) {
        $rootScope.isLoading = true;
        providerCEP.obterPorCodigo(codigo).then(function(success) {
          $rootScope.isLoading = false;
          console.log(success.data);
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
          return;
        }
        $scope.pessoa.enderecos.splice($index, 1);
      };

      $scope.addContato = function() {
        $scope.pessoa.contatos.push(new Contato());
      };

      $scope.removeContato = function($index) {
        if ($scope.pessoa.contatos.length <= 1) {
          return;
        }
        $scope.pessoa.contatos.splice($index, 1);
      };

      $scope.salvar = function() {
        console.log($scope.pessoa);
      }

    }
  ]);
