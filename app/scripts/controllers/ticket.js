/**
 * Created by egmfilho on 21/06/16.
 */
'use strict';

angular.module('belissimaApp.controllers')
  .controller('TicketCtrl', TicketCtrl);

TicketCtrl.$inject = [
  '$rootScope',
  '$scope',
  '$routeParams',
  '$location',
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

function TicketCtrl($rootScope, $scope, $routeParams, $location, providerPessoa, modalBuscarPessoa, Pessoa, Pedido, modalBuscarProduto, providerProduto, Produto, ItemPedido, providerPrazo, PrazoPagamento, modalPrazo, Pagamento, providerTicket) {

  var self = this, escape_confirm = false;

  this.novoTicket = new Pedido();
  this.novoItem = new ItemPedido();

  $scope.ticketsArray = [];

  $scope.pagination = {
    current: 1,
    max: 15,
    total: 0,
    pageChanged: getTickets
  };
  $scope.opcao = 'listar';

  $scope.$on('$locationChangeStart', function( event ) {
    if (escape_confirm) return;
    console.log($location);

    if (self.novoTicket.items.length || self.novoTicket.cliente.id || self.novoTicket.pagamentos.length) {
      if (!confirm('Deseja sair?')) {
        event.preventDefault();
      }
    }

  });

  function getTickets() {
    $rootScope.loading.load();
    providerTicket.obterTodos(null, true, null, null, null, null, null, null, null, ($scope.pagination.current - 1) * $scope.pagination.max + ',' + $scope.pagination.max).then(function(success) {
      $scope.pagination.total = success.info.ticket_quantity;
      $scope.ticketsArray = [];
      angular.forEach(success.data, function (item, index) {
        $scope.ticketsArray.push(new Pedido(Pedido.converterEmEntrada(item)));
      });
      $rootScope.loading.unload();
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  }

  function obterTicket(codigo) {
    $rootScope.loading.load();
    providerTicket.obterPorCodigo(codigo).then(function(success) {
      self.novoTicket = new Pedido(Pedido.converterEmEntrada(success.data));
      self.cdPrazo = self.novoTicket.prazo.codigo;
      self.tempPrazo = new PrazoPagamento(self.novoTicket.prazo);
      $rootScope.loading.unload();
      if ($routeParams.action == 'edit' && self.novoTicket.statusId != 1001) {
        $rootScope.alerta.show('Ticket indisponível para edição!', 'alert-danger');
        escape_confirm = true;
        $location.search('action', null);
        $location.search('code', null);
        $location.path('/ticket/list');
      }
      console.log(self.novoTicket);
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  }

  $scope.$on('$viewContentLoaded', function () {
    // compensa o scroll do tbody no thead se o SO nao for um MacOS
    if (navigator.platform !== 'MacIntel') {
      // angular.element('#tabela-ticket thead tr').css('padding-right', '18px');
    }

    getTickets();

    if ($routeParams.action) {
      switch ($routeParams.action) {
        case 'new':
          $scope.opcao = 'novo';
          break;
        case 'edit':
          if ($routeParams.code) {
            $scope.opcao = 'novo';
            obterTicket($routeParams.code);
          } else {

          }
          break;
        case 'list':
          $scope.opcao = 'listar';
          break;
      }
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
    if (!self.novoItem.produtoId || !self.novoItem.funcionarioId) {
      return;
    }

    if (self.novoItem.quantidade > 0) {
      self.novoTicket.addItem(self.novoItem);
    }

    self.cdProduto = '';
    self.tempProduto = null;
    self.cdFuncionario = '';
    self.tempFuncionario = null;
    self.novoItem = new ItemPedido();

    setParcelas();

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
      self.novoTicket.setPrazo(prazo);
      self.cdPrazo = self.novoTicket.prazo.codigo;
      self.tempPrazo = new PrazoPagamento(self.novoTicket.prazo);
      setParcelas();
    }
  };

  function setParcelas() {
    console.log(self.novoTicket.pagamentos.length);
    if (self.novoTicket.pagamentos.length == self.novoTicket.prazo.parcelas) {
      for (var i = 0; i < self.novoTicket.prazo.parcelas; i++) {
        self.novoTicket.pagamentos[i].valor = self.novoTicket.getValorTotal() / self.novoTicket.prazo.parcelas;
      }
    } else {
      self.novoTicket.pagamentos = [];
      for (var i = 0; i < self.novoTicket.prazo.parcelas; i++) {
        self.novoTicket.pagamentos.push(new Pagamento());
        self.novoTicket.pagamentos[i].valor = self.novoTicket.getValorTotal() / self.novoTicket.prazo.parcelas;
        self.novoTicket.pagamentos[i].vencimento = $scope.getDataDaParcela(self.novoTicket.prazo, i);
      }
    }
  }

  $scope.removeItem = function (item) {
    self.novoTicket.removeItem(item);
    setParcelas();
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
      if (!self.novoTicket.pagamentos[i].formaId) {
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

    console.log(self.novoTicket);
    console.log(Pedido.converterEmSaida(self.novoTicket));

    $rootScope.loading.load();
    if (self.novoTicket.id) {
      providerTicket.editar(Pedido.converterEmSaida(self.novoTicket)).then(function(success) {
        $rootScope.alerta.show('Ticket editado!', 'alert-success');
        escape_confirm = true;
        $location.path('ticket/list');
        $location.search('code', null);
        $rootScope.loading.unload();
      }, function(error) {
        console.log(error);
        $rootScope.loading.unload();
      });
    } else {
      providerTicket.salvar(Pedido.converterEmSaida(self.novoTicket)).then(function(success) {
        $rootScope.alerta.show('Ticket salvo!', 'alert-success');
        escape_confirm = true;
        $location.path('ticket/list');
        $rootScope.loading.unload();
      }, function(error) {
        console.log(error);
        $rootScope.loading.unload();
      });
    }
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

  $scope.abrirResumo = function(ticket) {
    $rootScope.loading.load();
    providerTicket.obterPorCodigo(ticket.codigo, true, true, true, true, true, true, true, true).then(function(success) {
      $scope.ticketDoModal = new Pedido(Pedido.converterEmEntrada(success.data));
      $rootScope.loading.unload();
      jQuery('#modalTicket').modal('show');
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
    });

  };

  $scope.excluirTicket = function(id) {
    $rootScope.loading.load();
    providerTicket.excluir(id).then(function(success) {
      $rootScope.loading.unload();
      $rootScope.alerta.show('Ticket excluido', 'alert-success');
      getTickets();
    });
  };
}
