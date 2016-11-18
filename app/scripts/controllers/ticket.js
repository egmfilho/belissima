/**
 * Created by egmfilho on 21/06/16.
 */
'use strict';

angular.module('belissimaApp.controllers')
  .controller('TicketCtrl', TicketCtrl);

TicketCtrl.$inject = ['$rootScope', '$scope', 'ProviderPessoa', 'ModalBuscarPessoa', 'Pessoa', 'Pedido', 'ModalBuscarProduto', 'ProviderProduto', 'Produto', 'ItemPedido'];

function TicketCtrl($rootScope, $scope, providerPessoa, modalBuscarPessoa, Pessoa, Pedido, modalBuscarProduto, providerProduto, Produto, ItemPedido) {

  var self = this;

  this.novoTicket = new Pedido();
  this.novoItem = new ItemPedido();

  $scope.pagination = {
    current: 1,
    max: 10,
    total: 0
  };

  $scope.$on('$viewContentLoaded', function () {
    // compensa o scroll do tbody no thead se o SO nao for um MacOS
    if (navigator.platform !== 'MacIntel') {
      angular.element('#tabela-ticket thead tr').css('padding-right', '18px');
    }
  });

  function buscarPessoa(categoriaId) {
    modalBuscarPessoa.show(categoriaId).then(function (result) {
      if (result) {
        console.log(result);
        if (categoriaId == $rootScope.categoriaPessoa.cliente.id) {
          self.novoTicket.setCliente(new Pessoa(result));
        } else if (categoriaId == $rootScope.categoriaPessoa.funcionario.id) {
          self.novoTicket.setFuncionario(new Pessoa(result));
        }
      }
      console.log(self.novoTicket);
    });
  }

  $scope.buscarFuncionario = function () {
    buscarPessoa($rootScope.categoriaPessoa.funcionario.id);
  };

  $scope.buscarFuncionarioPorCodigo = function(codigo) {
    $rootScope.loading.load();
    providerPessoa.obterPessoaPorCodigo(codigo, $rootScope.categoriaPessoa.funcionario.id).then(function(success) {
      $rootScope.loading.unload();
      self.novoItem.setFuncionario(new Pessoa(Pessoa.converterEmEntrada(success.data)));
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  };

  $scope.buscarProduto = function () {
    modalBuscarProduto.show().then(function (result) {
      $scope.selectProduto(result);
    });
  };

  $scope.buscarProdutoPorCodigo = function(codigo) {
    $rootScope.loading.load();
    providerProduto.obterProdutoPorCodigo(codigo).then(function(success) {
      $scope.selectProduto(new Produto(Produto.converterEmEntrada(success.data)));
      $rootScope.loading.unload();
      self.focarQuantidade();
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
      if (error.status == 404) {
        console.log('Produto não encontrado!');
        $rootScope.alerta.show('Produto não encontrado!');
      }
    });
  };

  $scope.buscarProdutoPorNome = function(nome) {
    $rootScope.loading.load();
    return providerProduto.obterProdutosPorNome(nome).then(function(success) {
      var produtos = [];
      angular.forEach(success.data, function(item, index) {
        produtos.push(new Produto(Produto.converterEmEntrada(item)));
      });
      $rootScope.loading.unload();
      return produtos;
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
      return [];
    });
  };

  $scope.selectProduto = function(produto) {
    if (produto.codigo === -1) {
      $scope.buscarProduto();
    } else {
      self.cdProduto = produto.codigo;
      if (!self.tempProduto) {
        self.tempProduto = produto;
      }
      self.novoItem.setProduto(new Produto(produto));
      self.focarQuantidade();
    }
  };

  $scope.addItem = function() {
    if (!self.novoItem.produtoId) {
      return;
    }

    if (self.novoItem.quantidade > 0) {
      self.novoTicket.addItem(self.novoItem);
    }

    self.cdProduto = '';
    self.tempProduto = null;
    self.novoItem = new ItemPedido();

    focarCodigo();
  };

  $scope.removeItem = function(item) {
    self.novoTicket.removeItem(item);
  };

  function focarCodigo() {
    jQuery('input[name="cdProduto"]').focus().select();
  }

  function focarNome() {
    jQuery('input[name="nmProduto"]').focus().select();
  }

  this.focarQuantidade = function() {
    jQuery('input[name="qtdProduto"]').focus().select();
  };

  this.focarFuncionario = function() {
    jQuery('input[name="cdFuncionario"]').focus().select();
  };

  $scope.buscarCliente = function () {
    buscarPessoa($rootScope.categoriaPessoa.cliente.id);
  };

  $scope.buscarClientePorCodigo = function(codigo) {
    $rootScope.loading.load();
    providerPessoa.obterPessoaPorCodigo(codigo, $rootScope.categoriaPessoa.cliente.id).then(function(success) {
      $rootScope.loading.unload();
      self.novoTicket.setCliente(new Pessoa(Pessoa.converterEmEntrada(success.data)));
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  };

  function validar() {
    if (!self.novoTicket.funcionarioId) {
      $rootScope.alerta.show('Informe o funcionário!', 'alert-danger');
      return false;
    }

    if (!self.novoTicket.items.length) {
      $rootScope.alerta.show('O ticket não possui produtos ou serviços!', 'alert-danger');
      return false;
    }

    if (!self.novoTicket.clienteId) {
      $rootScope.alerta.show('Informe o cliente!', 'alert-danger');
      return false;
    }

    return true;
  }

  this.salvar = function() {
    if (!validar()) {
      return;
    }

    console.log(self.novoTicket);
  }
}
