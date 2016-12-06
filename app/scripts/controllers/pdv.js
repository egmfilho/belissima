/**
 * Created by egmfilho on 28/11/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('PDVCtrl', PDVCtrl);

PDVCtrl.$inject = [
  '$rootScope',
  '$scope',
  'ModalBuscarTicket',
  'ProviderTicket',
  'Pedido',
  'ModalBuscarProduto',
  'ProviderProduto',
  'Produto',
  'ItemPedido',
  'ProviderPessoa',
  'Pessoa',
  'ProviderPrazoPagamento',
  'PrazoPagamento',
  'ModalBuscarPrazoPagamento',
  'ModalConfirm',
  'ProviderPDV'
];

function PDVCtrl($rootScope, $scope, modalBuscarTicket, providerTicket, Ticket, modalBuscarProduto, providerProduto, Produto, ItemPedido, providerPessoa, Pessoa, providerPrazo, PrazoPagamento, modalBuscarPrazo, modalConfirm, providerPDV) {

  var self = this,
      itemIndex = 0;

  this.ticket = new Ticket();
  this.tempItem = new ItemPedido();

  this.edicao = false;

  $scope.$on('$viewContentLoaded', function () {

    jQuery('body').bind('keyup', function (event) {
      // TECLA F2
      if (event.keyCode === 113) {
        jQuery('#modalTroco').modal('show');
      }
      // TECLA F6
      if (event.keyCode === 117) {
        if (self.ticket.codigo) {
          $rootScope.alerta.show('Não é possível editar um Ticket na tela de PDV!');
          return;
        }
        // self.edicao = !self.edicao;
        // $scope.$apply();
        // event.preventDefault();
        self.abrirModalCancelarItem();
      }
      // TECLA F8
      if (event.keyCode === 119) {
        self.abrirModalCliente();
      }
      // TECLA F9
      if (event.keyCode === 120) {
        self.abrirModalPagamento();
      }
      // TECLA F9
      if (event.keyCode === 121) {
        self.fecharVenda();
      }
    });

    setTimeout(focarCodigo, 200);
  });

  $scope.$on("$destroy", function () {
    jQuery('body').unbind('keyup');
  });

  function focarCodigo() {
    jQuery('input[name="cdProduto"]').focus().select();
  }

  function focarQuantidade() {
    jQuery('input[name="quantidade"]').focus().select();
  }

  $scope.focarDescontoPercent = function () {
    jQuery('input[name="descontoPercent"]').focus().select();
  };

  $scope.focarDescontoDinheiro = function () {
    jQuery('input[name="descontoDinheiro"]').focus().select();
  };

  this.novo = function () {
    modalConfirm.show('Aviso', 'Todas as informações serão perdidas, deseja proseguir?').then(function (result) {
      self.cancelarEdicao();
      self.cdCliente = '';
      self.cdPrazo = '';
      self.tempPrazo = new PrazoPagamento();
      itemIndex = 0;
      self.ticket = new Ticket();
    });
  };

  this.abrirTicket = function () {
    modalBuscarTicket.show().then(function (result) {
      if (result) {
        $rootScope.loading.load();
        self.cancelarEdicao();
        itemIndex = 0;
        providerTicket.obterPorCodigo(result.codigo).then(function (success) {
          self.ticket = new Ticket(Ticket.converterEmEntrada(success.data));
          self.cdCliente = self.ticket.cliente.codigo;
          self.cdPrazo = self.ticket.prazo.codigo;
          self.tempPrazo = new PrazoPagamento(self.ticket.prazo);
          $rootScope.loading.unload();
          console.log(self.ticket);
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }
    });
  };

  this.buscarProduto = function () {
    modalBuscarProduto.show().then(function (result) {
      if (result) {
        self.tempItem.setProduto(new Produto(result));
        self.cdProduto = self.tempItem.codigo;
      }
    });
  };

  this.buscarProdutoPorCodigo = function (codigo) {
    $rootScope.loading.load();
    providerProduto.obterProdutoPorCodigo(codigo).then(function (success) {
      self.tempItem.setProduto(new Produto(Produto.converterEmEntrada(success.data)));
      self.cdProduto = self.tempItem.produto.codigo;
      $rootScope.loading.unload();
      focarQuantidade();
    }, function (error) {
      console.log(error);
      $rootScope.loading.unload();
      if (error.status == 404) {
        $rootScope.alerta.show('Produto não encontrado!');
      }
    });
  };

  this.selectItem = function (item) {
    if (item.removido) {
      return;
    }

    this.tempItem = new ItemPedido(item);
    this.tempItem.edicao = this.ticket.items.indexOf(item);
    this.cdProduto = self.tempItem.produto.codigo;
    jQuery('input[name="cdProduto"]').attr('disabled', true);
    jQuery('button[name="btnProduto"]').prop('disabled', true);
    focarQuantidade();
  };

  this.cancelarEdicao = function () {
    jQuery('input[name="cdProduto"]').attr('disabled', false);
    jQuery('button[name="btnProduto"]').prop('disabled', false);
    jQuery('input[name="quantidade"]').attr('disabled', false);
    jQuery('input[name="descontoPercent"]').attr('disabled', false);
    jQuery('input[name="descontoDinheiro"]').attr('disabled', false);
    this.tempItem = new ItemPedido();
    this.cdProduto = null;
    focarCodigo();
  };

  this.addItem = function () {
    if (!this.tempItem.produto.id || this.tempItem.quantidade <= 0) {
      this.cancelarEdicao();
      return;
    }

    if (this.tempItem.hasOwnProperty('edicao')) {
      this.ticket.items[this.tempItem.edicao] = new ItemPedido(this.tempItem);
      jQuery('input[name="cdProduto"]').attr('disabled', false);
      jQuery('button[name="btnProduto"]').prop('disabled', false);
    } else {
      this.tempItem.index = itemIndex;
      this.ticket.addItem(this.tempItem);
      itemIndex++;
      jQuery(".nota").animate({scrollTop: $('.nota').prop("scrollHeight")}, 1000);
    }

    this.tempItem = new ItemPedido();
    this.cdProduto = null;
    focarCodigo();
  };

  this.abrirModalCancelarItem = function() {
    jQuery('#modalCancelarItem').on('shown.bs.modal', function(e) {
      jQuery('input[name="numItem"]').focus().select();
    }).modal('show');
  };

  this.removerItem = function (index) {
    // METODO ANTIGO ONDE INSERIA QUANTIDADE NEGATIVA
    // var item = new ItemPedido(this.ticket.items[index]);
    // item.quantidade *= -1;
    // console.log(item);
    // this.ticket.addItem(new ItemPedido(item));

    if (this.ticket.items[index].removido) {
      return;
    }

    this.ticket.items[index].removido = true;
    jQuery('#modalCancelarItem').modal('hide');
    focarCodigo();
  };

  this.abrirModalCliente = function () {
    jQuery('#modalCliente').on('shown.bs.modal', function(e) {
      jQuery('input[name="cdCliente"]').focus().select();
    }).modal('show');
  };

  this.buscarClientePorCodigo = function (codigo) {
    if (parseInt(codigo) == parseInt(this.ticket.cliente.codigo)) {
      jQuery('#modalCliente').modal('hide');
      return;
    }

    $rootScope.loading.load();
    providerPessoa.obterPessoaPorCodigo(codigo, $rootScope.categoriaPessoa.cliente.id).then(function (success) {
      self.ticket.setCliente(new Pessoa(Pessoa.converterEmEntrada(success.data)));
      $rootScope.loading.unload();
    }, function (error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  };

  this.abrirModalPagamento = function () {
    jQuery('#modalPagamento').on('shown.bs.modal', function(e) {
      jQuery('input[name="cdPrazo"]').focus().select();
    }).modal('show');
  };

  this.buscarPrazosPorDescricao = function (descricao) {
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

  this.buscarPrazoPorCodigo = function (codigo) {
    $rootScope.loading.load();
    providerPrazo.obterPorCodigo(codigo).then(function (success) {
      self.selectPrazo(new PrazoPagamento(PrazoPagamento.converterEmEntrada(success.data)));
      $rootScope.loading.unload();
    }, function (error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  };

  this.prepararPrazo = function(prazo) {
    $rootScope.loading.load();
    providerPrazo.obterPorCodigo(prazo.codigo).then(function (success) {
      self.selectPrazo(new PrazoPagamento(PrazoPagamento.converterEmEntrada(success.data)));
      $rootScope.loading.unload();
    }, function (error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  };

  this.selectPrazo = function (prazo) {
    if (prazo.codigo === -1) {
      $scope.buscarPrazo();
    } else {
      self.ticket.setPrazo(prazo);
      self.cdPrazo = self.ticket.prazo.codigo;
      self.tempPrazo = new PrazoPagamento(self.ticket.prazo);
      setParcelas();
    }
  };

  function setParcelas() {
    if (self.ticket.pagamentos.length == self.ticket.prazo.parcelas) {
      for (var i = 0; i < self.ticket.prazo.parcelas; i++) {
        self.ticket.pagamentos[i].valor = self.ticket.getValorTotal() / self.ticket.prazo.parcelas;
      }
    } else {
      self.ticket.pagamentos = [];
      for (var i = 0; i < self.ticket.prazo.parcelas; i++) {
        self.ticket.pagamentos.push(new Pagamento());
        self.ticket.pagamentos[i].valor = self.ticket.getValorTotal() / self.ticket.prazo.parcelas;
        self.ticket.pagamentos[i].vencimento = getDataDaParcela(self.ticket.prazo, i);
      }
    }
  }

  this.abrirModalFuncionario = function () {
    jQuery('#modalFuncionario').on('shown.bs.modal', function(e) {
      jQuery('input[name="cdFuncionario"]').focus().select();
    }).modal('show');
  };

  this.buscarFuncionarioPorCodigo = function (codigo) {
    if (parseInt(codigo) == parseInt(this.ticket.funcionario.codigo)) {
      jQuery('#modalFuncionario').modal('hide');
      return;
    }

    $rootScope.loading.load();
    providerPessoa.obterPessoaPorCodigo(codigo, $rootScope.categoriaPessoa.funcionario.id).then(function (success) {
      self.ticket.setFuncionario(new Pessoa(Pessoa.converterEmEntrada(success.data)));
      $rootScope.loading.unload();
    }, function (error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  };

  function getDataDaParcela(prazo, parcela) {
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
  }

  this.fecharVenda = function() {
    if (this.ticket.trueLength() == 0) {
      $rootScope.alerta.show('A lista de produtos está vazia!');
      return;
    }

    if (!this.ticket.clienteId) {
      this.abrirModalCliente();
      return;
    }

    if (!this.ticket.prazoId) {
      this.abrirModalPagamento();
      return;

    }

    if (!this.ticket.codigo && !this.ticket.funcionarioId) {
      this.abrirModalFuncionario();
      return;
    }

    console.log(Ticket.converterEmSaida(this.ticket));

    $rootScope.loading.load();
    providerPDV.salvar(Ticket.converterEmSaida(this.ticket)).then(function(success) {
      $rootScope.loading.unload();
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  }
}
