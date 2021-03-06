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
    'ModalEnderecos',
    function ($rootScope, $scope, provider, providerCategoriaPessoa, providerTipoContato, providerCEP, TipoContato, Endereco, CEP, Contato, Pessoa, CategoriaPessoa, TiposLogradouros, ModalBuscarEndereco, ModalEditarPessoa, modalConfirm, modalAlert, modalEnderecos) {

      var self = this;

      $scope.format = 'dd/MM/yyyy';

      $scope.dateOptions = {
        formatYear: 'yyyy',
        datepickerMode: 'year',
        startingDay: 0,
        showWeeks: false
      };

      this.viewContentLoaded = function() {
        console.log('ClientesCtrl');

        $scope.pessoa = new Pessoa();
        //$scope.pessoa.enderecos = [ new Endereco() ];
        $scope.pessoa.setEnderecoPrincipal(0);
        //$scope.pessoa.contatos = [ new Contato() ];
        $scope.pessoa.setContatoPrincipal(0);

        $scope.filtro = { categoria: null };

        $scope.categorias_pessoa = jQuery.map($rootScope.categoriaPessoa, function (item, index) {
          return [item];
        });

        $scope.tipos_logradouros = TiposLogradouros;

        getTiposContato();
      };

      $scope.$on('$viewContentLoaded', function () {
        self.viewContentLoaded();

        $scope.pagination = {
          current: 1,
          max: 15,
          total: 0
        };

        $scope.getClientes();
      });

      this.isFuncionario = function () {
        for (var i = 0; i < $scope.pessoa.categorias.length; i++) {
          if ($scope.pessoa.categorias[i].id == $rootScope.categoriaPessoa.funcionario.id) {
            return true;
          }
        }
        return false;
      };

      $scope.getClientes = function () {
        $rootScope.loading.load();
        provider.obterPessoasPorCategoria($scope.filtro.categoria, true, true, true, true, true, true, true, true, ($scope.pagination.current - 1) * $scope.pagination.max + ',' + $scope.pagination.max).then(function (success) {
          $scope.pagination.total = success.info.person_quantity;
          $scope.pessoas = [];
          angular.forEach(success.data, function (item, index) {
            $scope.pessoas.push(new Pessoa(Pessoa.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      };

      $scope.pageChanged = function () {
        $scope.getClientes();
      };

      function getTiposContato() {
        $scope.tipos_contatos = [];
        $rootScope.loading.load();
        providerTipoContato.obterTodos().then(function (success) {
          angular.forEach(success.data, function (item, index) {
            $scope.tipos_contatos.push(new TipoContato(TipoContato.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
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

        $rootScope.loading.load();
        providerCEP.obterPorCodigo(codigo, true, true).then(function (success) {
          $rootScope.loading.unload();
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
          $rootScope.loading.unload();
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
          $rootScope.loading.load();
          provider.salvarPessoa(Pessoa.converterEmSaida($scope.pessoa)).then(function (success) {
            console.log(success);
            $scope.$emit('novoCliente', success.data);
            $scope.pessoa = new Pessoa();
            $rootScope.loading.unload();
            $scope.getClientes();
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
          });
        });
      };

      $scope.limparTudo = function () {
        modalConfirm.show('Aviso', 'Limpar campos?', 'Sim', 'Não').then(function () {
          $scope.pessoa = new Pessoa();
        });
      };

      $scope.editar = function (pessoa) {
        $rootScope.loading.load();
        if (pessoa) {
          provider.obterPessoaPorCodigo(pessoa.codigo, pessoa.categorias.length ? pessoa.categorias[0].id : null, true, null, true, true, true, true, null, true).then(function (success) {
            $rootScope.loading.unload();
            ModalEditarPessoa.show(new Pessoa(Pessoa.converterEmEntrada(success.data)), function (result) {
              if (result) {
                console.log(result);
                if (result === 'excluir') {
                  $scope.excluir(pessoa);
                  $scope.getClientes();
                }
              }
            });
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
          });
        }
      };

      $scope.excluir = function (pessoa) {

        modalConfirm.show('Aviso', 'Excluir pessoa código: ' + pessoa.codigo + '?', 'Sim', 'Não').then(function () {
          $rootScope.loading.load();
          provider.excluirPessoa(pessoa).then(function (success) {
            console.log(success);
            modalAlert.show('Excluído', 'Pessoa excluída!');
            $scope.getClientes();
            $rootScope.loading.unload();
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
          });
        });
      };

      $scope.abrirModalNovoEndereco = function() {
        // jQuery('#modalNovoEndereco').modal({
        //   backdrop: false,
        //   keyboard: false
        // }).modal('show');
        modalEnderecos.show();
      };

    }
  ]);
