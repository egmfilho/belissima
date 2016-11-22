/**
 * Created by egmfilho on 21/06/16.
 */
'use strict';

angular.module('belissimaApp.controllers')
  .controller('TicketCtrl', TicketCtrl);

TicketCtrl.$inject = [
  '$rootScope',
  '$scope',
  'ProviderPessoa',
  'ModalBuscarPessoa',
  'Pessoa',
  'Pedido',
  'ModalBuscarProduto',
  'ProviderProduto',
  'Produto',
  'ItemPedido',
  'ProviderPrazoPagamento',
  'PrazoPagamento',
  'ModalBuscarPrazoPagamento',
  'Pagamento',
  'ProviderTicket'
];

function TicketCtrl($rootScope, $scope, providerPessoa, modalBuscarPessoa, Pessoa, Pedido, modalBuscarProduto, providerProduto, Produto, ItemPedido, providerPrazo, PrazoPagamento, modalPrazo, Pagamento, providerTicket) {

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
      // angular.element('#tabela-ticket thead tr').css('padding-right', '18px');
    }
  });

  function focarCodigoFuncionario() {
    jQuery('input[name="cdFuncionario"]').focus().select();
  }

  function focarCodigoProduto() {
    jQuery('input[name="cdProduto"]').focus().select();
  }

  function focarNome() {
    jQuery('input[name="nmProduto"]').focus().select();
  }

  this.focarQuantidade = function () {
    jQuery('input[name="qtdProduto"]').focus().select();
  };

  this.focarFuncionario = function () {
    jQuery('input[name="cdFuncionario"]').focus().select();
  };

  function buscarPessoa(categoriaId) {
    modalBuscarPessoa.show(categoriaId).then(function (result) {
      if (result) {
        console.log(result);
        if (categoriaId == $rootScope.categoriaPessoa.cliente.id) {
          self.novoTicket.setCliente(new Pessoa(result));
        } else if (categoriaId == $rootScope.categoriaPessoa.funcionario.id) {
          $scope.selectFuncionario(result);
        }
      }
    });
  }

  $scope.buscarFuncionario = function () {
    buscarPessoa($rootScope.categoriaPessoa.funcionario.id);
  };

  $scope.buscarFuncionarioPorCodigo = function (codigo) {
    $rootScope.loading.load();
    providerPessoa.obterPessoaPorCodigo(codigo, $rootScope.categoriaPessoa.funcionario.id).then(function (success) {
      $scope.selectFuncionario(new Pessoa(Pessoa.converterEmEntrada(success.data)));
      $rootScope.loading.unload();
      focarCodigoProduto();
    }, function (error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  };

  $scope.buscarFuncionarioPorNome = function (nome) {
    $rootScope.loading.load();
    return providerPessoa.obterPessoasPorNome($rootScope.categoriaPessoa.funcionario.id, nome).then(function (success) {
      var funcionarios = [];
      angular.forEach(success.data, function (item, index) {
        funcionarios.push(new Pessoa(Pessoa.converterEmEntrada(item)));
      });
      $rootScope.loading.unload();
      return funcionarios;
    }, function (error) {
      console.log(error);
      $rootScope.loading.unload();
      return [];
    });
  };

  $scope.selectFuncionario = function (funcionario) {
    if (funcionario.codigo === -1) {
      $scope.buscarFuncionario();
    } else {
      self.novoItem.setFuncionario(new Pessoa(funcionario));
      self.cdFuncionario = self.novoItem.funcionario.codigo;
      self.tempFuncionario = self.novoItem.funcionario;
    }
  };

  $scope.buscarProduto = function () {
    modalBuscarProduto.show().then(function (result) {
      $scope.selectProduto(result);
    });
  };

  $scope.buscarProdutoPorCodigo = function (codigo) {
    $rootScope.loading.load();
    providerProduto.obterProdutoPorCodigo(codigo).then(function (success) {
      $scope.selectProduto(new Produto(Produto.converterEmEntrada(success.data)));
      $rootScope.loading.unload();
      self.focarQuantidade();
    }, function (error) {
      console.log(error);
      $rootScope.loading.unload();
      if (error.status == 404) {
        console.log('Produto não encontrado!');
        $rootScope.alerta.show('Produto não encontrado!');
      }
    });
  };

  $scope.buscarProdutoPorNome = function (nome) {
    $rootScope.loading.load();
    return providerProduto.obterProdutosPorNome(nome, 10).then(function (success) {
      var produtos = [];
      angular.forEach(success.data, function (item, index) {
        produtos.push(new Produto(Produto.converterEmEntrada(item)));
      });
      produtos.push({
        codigo: -1,
        nome: 'Mais resultados...'
      });
      $rootScope.loading.unload();
      return produtos;
    }, function (error) {
      console.log(error);
      $rootScope.loading.unload();
      return [];
    });
  };

  $scope.selectProduto = function (produto) {
    if (produto.codigo === -1) {
      self.tempProduto = new Produto();
      $scope.buscarProduto();
    } else {
      self.novoItem.setProduto(new Produto(produto));
      self.cdProduto = self.novoItem.produto.codigo;
      self.tempProduto = self.novoItem.produto;
      self.focarQuantidade();
    }
  };

  $scope.addItem = function () {
    if (!self.novoItem.produtoId) {
      return;
    }

    if (self.novoItem.quantidade > 0) {
      self.novoTicket.addItem(self.novoItem);
    }

    self.cdProduto = '';
    self.tempProduto = null;
    self.novoItem = new ItemPedido();

    focarCodigoFuncionario();
  };

  $scope.buscarPrazo = function() {
    modalPrazo.show().then(function(result) {
      $scope.selectPrazo(result);
    });
  };

  $scope.buscarPrazoPorCodigo = function (codigo) {
    $rootScope.loading.load();
    providerPrazo.obterPorCodigo(codigo).then(function (success) {
      $scope.selectPrazo(new PrazoPagamento(PrazoPagamento.converterEmEntrada(success.data)));
      $rootScope.loading.unload();
    }, function (error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  };

  $scope.buscarPrazosPorDescricao = function (descricao) {
    $rootScope.loading.load();
    return providerPrazo.obterPorDescricao(descricao).then(function (success) {
      var prazos = [];
      angular.forEach(success.data, function (item, index) {
        prazos.push(new PrazoPagamento(PrazoPagamento.converterEmEntrada(item)));
      });
      $rootScope.loading.unload();
      return prazos;
    }, function (error) {
      if (error.status == 404) {
        $rootScope.alerta.show('Não encontrado!');
      }
      console.log(error);
      $rootScope.loading.unload();
    });
  };

  $scope.prepararPrazo = function(prazo) {
    $rootScope.loading.load();
    providerPrazo.obterPorCodigo(prazo.codigo).then(function (success) {
      $scope.selectPrazo(new PrazoPagamento(PrazoPagamento.converterEmEntrada(success.data)));
      $rootScope.loading.unload();
    }, function (error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  };

  $scope.selectPrazo = function (prazo) {
    if (prazo.codigo === -1) {
      $scope.buscarPrazo();
    } else {
      self.prazo = new PrazoPagamento(prazo);
      self.cdPrazo = self.prazo.codigo;
      self.tempPrazo = new PrazoPagamento(self.prazo);
      self.novoTicket.pagamentos = [];
      for (var i = 0; i < self.prazo.parcelas; i++) {
        self.novoTicket.pagamentos.push(new Pagamento());
      }
    }
  };

  $scope.removeItem = function (item) {
    self.novoTicket.removeItem(item);
  };

  $scope.buscarCliente = function () {
    buscarPessoa($rootScope.categoriaPessoa.cliente.id);
  };

  $scope.buscarClientePorCodigo = function (codigo) {
    $rootScope.loading.load();
    providerPessoa.obterPessoaPorCodigo(codigo, $rootScope.categoriaPessoa.cliente.id).then(function (success) {
      $rootScope.loading.unload();
      self.novoTicket.setCliente(new Pessoa(Pessoa.converterEmEntrada(success.data)));
    }, function (error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  };

  function validar() {
    if (!self.novoTicket.items.length) {
      $rootScope.alerta.show('O ticket não possui produtos ou serviços!', 'alert-danger');
      return false;
    }

    if (!self.novoTicket.clienteId) {
      $rootScope.alerta.show('Informe o cliente!', 'alert-danger');
      return false;
    }

    for (var i = 0; i < self.novoTicket.pagamentos.length; i++) {
      if (!self.novoTicket.pagamentos[i].forma) {
        $rootScope.alerta.show('Informe todas as formas de pagamento!', 'alert-danger');
        return false;
      }

      if (self.novoTicket.pagamentos[i].valor <= 0) {
        $rootScope.alerta.show('Preencha corretamente os valores das parcelas!', 'alert-danger');
        return false;
      }
    }

    if (self.novoTicket.getTroco() != 0) {
      $rootScope.alerta.show('Informe corretamente os valores!', 'alert-danger');
      return false;
    }

    return true;
  }

  this.salvar = function () {
    if (!validar()) {
      return;
    }

    console.log(Pedido.converterEmSaida(self.novoTicket));

    $rootScope.loading.load();
    providerTicket.salvar(Pedido.converterEmSaida(self.novoTicket)).then(function(success) {
      $rootScope.loading.unload();
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  };

  $scope.getDataDaParcela = function (prazo, parcela) {
    var hoje = new Date();

    if (parcela < 0) {
      return;
    }

    if (parcela == 0) {
      hoje.setDate(hoje.getDate() + prazo.iniciaEm);
    } else {
      hoje.setDate(hoje.getDate() + prazo.iniciaEm + (prazo.intervalo * parcela));
    }

    return hoje;
  };
}
