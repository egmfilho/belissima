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
    'ProviderCEP',
    'CEP',
    'TipoContato',
    'Pessoa',
    'CategoriaPessoa',
    'Endereco',
    'ContatoPessoa',
    'ModalBuscarEndereco',
    'ModalConfirm',
    'TiposLogradouros',
    'ModalEnderecos',
    'pessoa',
    function ($rootScope, $scope, $uibModalInstance, provider, providerCategoriaPessoa, providerTipoContato, providerCEP, CEP, TipoContato, Pessoa, CategoriaPessoa, Endereco, Contato, ModalBuscarEndereco, modalConfirm, TiposLogradouros, modalEnderecos, pessoa) {

      $scope.format = 'dd/MM/yyyy';

      $scope.dateOptions = {
        formatYear: 'yyyy',
        datepickerMode: 'year',
        startingDay: 0,
        showWeeks: false
      };

      $uibModalInstance.opened.then(function () {
        $scope.pessoa = new Pessoa(pessoa);
        $scope.tipos_logradouros = TiposLogradouros;

        $scope.categorias_pessoa = [];
        if ($rootScope.categoriaPessoa) {
          $scope.categorias_pessoa = jQuery.map($rootScope.categoriaPessoa, function (item, index) {
            return [item];
          });
        } else {
          getContatosPessoa();
        }

        getTiposContato();
      });

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

      function getContatosPessoa() {
        $rootScope.loading.load();
        providerCategoriaPessoa.obterTodos().then(function (success) {
          angular.forEach(success.data, function (contato, index) {
            $scope.categorias_pessoa.push(new CategoriaPessoa(CategoriaPessoa.converterEmEntrada(contato)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        })
      }

      $scope.getMascaraContato = function (id) {
        return $scope.tipos_contatos.find(function (tipo) {
          return tipo.id === id;
        });
      };

      $scope.addEndereco = function () {
        $scope.pessoa.enderecos.push(new Endereco());
        if ($scope.pessoa.enderecos.length === 1) {
          $scope.pessoa.setEnderecoPrincipal(0);
        }
      };

      $scope.removeEndereco = function ($index) {
        modalConfirm.show(null, 'Remover Endereço?').then(function () {
          if ($scope.pessoa.enderecos.length <= 0) {
            $scope.pessoa.enderecos[0] = new Endereco();
            $scope.pessoa.enderecos[0].principal = true;
            return;
          }
          $scope.pessoa.removerEndereco($index);
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

        // if (pessoa.tipo === 'F') {
        //   if (!pessoa.cpf) {
        //     $rootScope.alerta.show('Insira o CPF!', 'alert-danger');
        //     return false;
        //   }
        // } else {
        //   if (!pessoa.cnpj) {
        //     $rootScope.alerta.show('Insira o CNPJ!', 'alert-danger');
        //     return false;
        //   }
        // }

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

        modalConfirm.show('Aviso', 'Salvar as alterações?', 'Sim', 'Não').then(function () {
          $rootScope.loading.load();
          console.log(Pessoa.converterEmSaida($scope.pessoa));
          provider.atualizarPessoa(Pessoa.converterEmSaida($scope.pessoa)).then(function (success) {
            console.log(success);
            $uibModalInstance.dismiss('cancel');
            $rootScope.loading.unload();
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
          });
        });
      };

      $scope.excluir = function () {
        modalConfirm.show('Aviso', 'Deseja excluir esta pessoa?', 'Sim', 'Não').then(function (result) {
          $uibModalInstance.close('excluir');
        });
      };

      $scope.fechar = function () {
        $uibModalInstance.dismiss('cancel');
      };

      $scope.abrirModalNovoEndereco = function() {
        modalEnderecos.show();
      };

    }]);
