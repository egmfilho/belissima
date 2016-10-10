/**
 * Created by egmfilho on 13/09/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('ClientesCtrl', [
    '$rootScope',
    '$scope',
    'ProviderPessoa',
    'ProviderCategoriaPessoa',
    'ProviderTipoContato',
    'ProviderCEP',
    'TipoContato',
    'Endereco',
    'CEP',
    'ContatoPessoa',
    'Pessoa',
    'CategoriaPessoa',
    'TiposLogradouros',
    'ModalBuscarEndereco',
    'ModalEditarPessoa',
    'ModalConfirm',
    'ModalAlert',
    function ($rootScope, $scope, provider, providerCategoriaPessoa, providerTipoContato, providerCEP, TipoContato, Endereco, CEP, Contato, Pessoa, CategoriaPessoa, TiposLogradouros, ModalBuscarEndereco, ModalEditarPessoa, modalConfirm, modalAlert) {

      var self = this;

      $scope.$on('$viewContentLoaded', function () {
        $scope.pessoa = new Pessoa();
        //$scope.pessoa.enderecos = [ new Endereco() ];
        $scope.pessoa.setEnderecoPrincipal(0);
        //$scope.pessoa.contatos = [ new Contato() ];
        $scope.pessoa.setContatoPrincipal(0);

        $scope.categorias_pessoa = jQuery.map($rootScope.categoriaPessoa, function (item, index) {
          return [item];
        });

        $scope.tipos_logradouros = TiposLogradouros;

        $scope.pagination = {
          current: 1,
          max: 15,
          total: 0
        };

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
        provider.obterTodos(true, true, true, true, true, true, true, true, ($scope.pagination.current - 1) * $scope.pagination.max + ',' + $scope.pagination.max).then(function (success) {
          $scope.pagination.total = success.info.person_quantity;
          $scope.pessoas = [];
          angular.forEach(success.data, function (item, index) {
            $scope.pessoas.push(new Pessoa(Pessoa.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

      $scope.pageChanged = function () {
        getClientes();
      };

      function getTiposContato() {
        $scope.tipos_contatos = [];
        $rootScope.isLoading = true;
        providerTipoContato.obterTodos().then(function (success) {
          angular.forEach(success.data, function (item, index) {
            $scope.tipos_contatos.push(new TipoContato(TipoContato.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

      $scope.getMascaraContato = function (id) {
        return $scope.tipos_contatos.find(function (tipo) {
          return tipo.id === id;
        });
      };

      $scope.getCEPPorCodigo = function (codigo, $index) {
        if (!codigo) {
          ModalBuscarEndereco.show(null, function (result) {
            if (result) $scope.pessoa.enderecos[$index].setCEP(result);
          });

          return;
        }

        $rootScope.isLoading = true;
        providerCEP.obterPorCodigo(codigo, true, true).then(function (success) {
          $rootScope.isLoading = false;
          var ceps = [];
          angular.forEach(success.data, function (item, index) {
            ceps.push(new CEP(CEP.converterEmEntrada(item)));
          });
          if (ceps.length > 1) {
            ModalBuscarEndereco.show(ceps, function (result) {
              if (result) $scope.pessoa.enderecos[$index].setCEP(result);
            });
          } else {
            $scope.pessoa.enderecos[$index].setCEP(ceps[0]);
          }
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      $scope.addEndereco = function () {
        $scope.pessoa.enderecos.push(new Endereco());
        if ($scope.pessoa.enderecos.length === 1) {
          $scope.pessoa.setEnderecoPrincipal(0);
        }
      };

      $scope.removeEndereco = function ($index) {
        modalConfirm.show(null, 'Remover endereço?').then(function () {
          if ($scope.pessoa.enderecos.length <= 0) {
            $scope.pessoa.enderecos[0] = new Endereco();
            $scope.pessoa.enderecos[0].principal = true;
            return;
          }
          $scope.pessoa.removerEndereco($index);
        });
      };

      $scope.addContato = function () {
        $scope.pessoa.contatos.push(new Contato());
        if ($scope.pessoa.contatos.length === 1) {
          $scope.pessoa.setContatoPrincipal(0);
        }
      };

      $scope.removeContato = function ($index) {
        modalConfirm.show(null, 'Remover Contato?').then(function () {
          if ($scope.pessoa.contatos.length <= 0) {
            $scope.pessoa.contatos[0] = new Contato();
            $scope.pessoa.contatos[0].principal = true;
            return;
          }
          $scope.pessoa.removerContato($index);
        });
      };

      function validar(pessoa) {
        var i;

        if (!pessoa.nome) {
          $rootScope.alerta.show('Insira o nome da pessoa!', 'alert-danger');
          return false;
        }

        //if (!pessoa.categorias.length) {
        //  return false;
        //}

        //if (pessoa.tipo === 'F') {
        //  if (!pessoa.cpf) {
        //    $rootScope.alerta.show('Insira o CPF!', 'alert-danger');
        //    return false;
        //  }
        //} else {
        //  if (!pessoa.cnpj) {
        //    $rootScope.alerta.show('Insira o CNPJ!', 'alert-danger');
        //    return false;
        //  }
        //}

        for (i = 0; i < pessoa.enderecos.length; i++) {
          if (!pessoa.enderecos[i].cep.codigo || !pessoa.enderecos[i].cep.uf || !pessoa.enderecos[i].cep.cidade.nome || !pessoa.enderecos[i].cep.bairro.nome) {
            $rootScope.alerta.show('Endereço incompleto!', 'alert-danger');
            return false;
          }

          if (!pessoa.enderecos[i].logradouro) {
            $rootScope.alerta.show('Endereço incompleto!', 'alert-danger');
            return false;
          }

          if (!pessoa.enderecos[i].numero) {
            $rootScope.alerta.show('Endereço incompleto!', 'alert-danger');
            return false;
          }
        }

        for (i = 0; i < pessoa.contatos.length; i++) {
          if (!pessoa.contatos[i].tipoId) {
            $rootScope.alerta.show('Contato incompleto!', 'alert-danger');
            return false;
          }

          if (!pessoa.contatos[i].contato) {
            $rootScope.alerta.show('Contato incompleto!', 'alert-danger');
            return false;
          }
        }

        return true;
      }

      $scope.salvar = function () {
        if (!validar($scope.pessoa)) {
          return;
        }

        console.log($scope.pessoa, Pessoa.converterEmSaida($scope.pessoa));

        modalConfirm.show('Aviso', 'Salvar as alterações?', 'Sim', 'Não').then(function () {
          $rootScope.isLoading = true;
          provider.salvarPessoa(Pessoa.converterEmSaida($scope.pessoa)).then(function (success) {
            console.log(success);
            $scope.pessoa = new Pessoa();
            $rootScope.isLoading = false;
            getClientes();
          }, function (error) {
            console.log(error);
            $rootScope.isLoading = false;
          });
        });
      };

      $scope.limparTudo = function () {
        modalConfirm.show('Aviso', 'Limpar campos?', 'Sim', 'Não').then(function () {
          $scope.pessoa = new Pessoa();
        });
      };

      $scope.editar = function (pessoa) {
        $rootScope.isLoading = true;
        if (pessoa) {
          provider.obterPessoaPorCodigo(pessoa.codigo, pessoa.categorias.length ? pessoa.categorias[0].id : null, true, null, true, true, true, true, null, true).then(function (success) {
            $rootScope.isLoading = false;
            ModalEditarPessoa.show(new Pessoa(Pessoa.converterEmEntrada(success.data)), function (result) {
              if (result) {
                console.log(result);
                if (result === 'excluir') {
                  $scope.excluir(pessoa);
                  getClientes();
                }
              }
            });
          }, function (error) {
            console.log(error);
            $rootScope.isLoading = false;
          });
        }
      };

      $scope.excluir = function (pessoa) {

        modalConfirm.show('Aviso', 'Excluir pessoa código: ' + pessoa.codigo + '?', 'Sim', 'Não').then(function () {
          $rootScope.isLoading = true;
          provider.excluirPessoa(pessoa).then(function (success) {
            console.log(success);
            modalAlert.show('Excluído', 'Pessoa excluída!');
            getClientes();
            $rootScope.isLoading = false;
          }, function (error) {
            console.log(error);
            $rootScope.isLoading = false;
          });
        });
      };

    }
  ]);
