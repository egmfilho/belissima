/**
 * Created by egmfilho on 28/11/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('PDVCtrl', PDVCtrl);

PDVCtrl.$inject = [
  '$rootScope',
  '$scope',
  '$location',
  'ModalBuscarTicket',
  'ProviderTicket',
  'Documento',
  'ModalBuscarProduto',
  'ProviderProduto',
  'Produto',
  'ItemPedido',
  'ProviderPessoa',
  'ModalBuscarPessoa',
  'Pessoa',
  'ProviderPrazoPagamento',
  'PrazoPagamento',
  'ModalBuscarPrazoPagamento',
  'Pagamento',
  'ModalConfirm',
  'ProviderPDV'
];

function PDVCtrl($rootScope, $scope, $location, modalBuscarTicket, providerTicket, Documento, modalBuscarProduto, providerProduto, Produto, ItemPedido, providerPessoa, modalBuscarPessoa, Pessoa, providerPrazo, PrazoPagamento, modalBuscarPrazo, Pagamento, modalConfirm, providerPDV) {

  var self = this,
    itemIndex = 0;

  this.documento = new Documento();
  this.tempItem = new ItemPedido();

  this.edicao = false;

  $scope.$on('$viewContentLoaded', function () {

    jQuery('body').bind('keyup', function (event) {
      // TECLA F2
      if (event.keyCode === 113) {
        console.log(self.documento);
        event.preventDefault();
      }
      // TECLA F6
      if (event.keyCode === 117) {
        if (self.documento.codigo) {
          $rootScope.alerta.show('Não é possível editar um Ticket na tela de PDV!');
          return;
        }
        // self.edicao = !self.edicao;
        // $scope.$apply();
        // event.preventDefault();
        self.abrirModalCancelarItem();

        event.preventDefault();
      }
      // TECLA F8
      if (event.keyCode === 119) {
        self.abrirModalCliente();
        event.preventDefault();
      }
      // TECLA F9
      if (event.keyCode === 120) {
        self.abrirModalPagamento();
        event.preventDefault();
      }
      // TECLA F10
      if (event.keyCode === 121) {
        self.prepararFechamento();
        event.preventDefault();
      }
    });

    setTimeout(focarCodigo, 200);
  });

  $scope.$on('$locationChangeStart', function( event ) {
    if (self.documento.items.length) {
      if (!confirm('Deseja sair?')) {
        event.preventDefault();
      }
    }
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

  this.novo = function (callback) {
    modalConfirm.show('Aviso', 'Todas as informações serão perdidas, deseja proseguir?').then(function (result) {
      self.cancelarEdicao();
      self.cdCliente = '';
      self.cdPrazo = '';
      self.tempPrazo = new PrazoPagamento();
      itemIndex = 0;
      self.documento = new Documento();

      if (callback) callback();
    });
  };

  function buscarTicket() {
    modalBuscarTicket.show('1001').then(function (result) {
      if (result) {
        $rootScope.loading.load();
        self.cancelarEdicao();
        itemIndex = 0;
        providerTicket.obterPorCodigo(result.codigo).then(function (success) {
          self.documento = new Documento(Documento.importarTicket(success.data));
          self.cdCliente = self.documento.cliente.codigo;
          self.cdPrazo = self.documento.prazo.codigo;
          self.tempPrazo = new PrazoPagamento(self.documento.prazo);
          $rootScope.loading.unload();
          console.log(self.documento);
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }
    });
  }

  this.abrirTicket = function () {
    this.novo(buscarTicket);
  };

  this.buscarProduto = function () {
    modalBuscarProduto.show().then(function (result) {
      if (result) {
        self.tempItem.setProduto(new Produto(result));
        self.cdProduto = self.tempItem.produto.codigo;
        focarQuantidade();
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
    this.tempItem.edicao = this.documento.items.indexOf(item);
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
      this.documento.items[this.tempItem.edicao] = new ItemPedido(this.tempItem);
      jQuery('input[name="cdProduto"]').attr('disabled', false);
      jQuery('button[name="btnProduto"]').prop('disabled', false);
    } else {
      this.tempItem.index = itemIndex;
      this.documento.addItem(this.tempItem);
      itemIndex++;
      jQuery(".nota").animate({scrollTop: $('.nota').prop("scrollHeight")}, 1000);
    }

    this.tempItem = new ItemPedido();
    this.cdProduto = null;
    focarCodigo();
  };

  this.abrirModalCancelarItem = function () {
    jQuery('#modalCancelarItem').on('shown.bs.modal', function (e) {
      jQuery('input[name="numItem"]').focus().select();
    }).modal('show');
  };

  this.removerItem = function (index) {
    // METODO ANTIGO ONDE INSERIA QUANTIDADE NEGATIVA
    // var item = new ItemPedido(this.documento.items[index]);
    // item.quantidade *= -1;
    // console.log(item);
    // this.documento.addItem(new ItemPedido(item));

    if (this.documento.items[index].removido) {
      return;
    }

    this.documento.items[index].removido = true;
    jQuery('#modalCancelarItem').modal('hide');
    focarCodigo();
  };

  this.abrirModalCliente = function (callback_positive, callback_negative) {
    jQuery('#modalCliente').on('shown.bs.modal', function (e) {
      jQuery('input[name="cdCliente"]').focus().select();
    }).modal('show').on('hidden.bs.modal', function (e) {
      if (callback_negative) callback_negative();
    }).find('.control button[name="positive"]').click(function () {
      if (callback_positive) callback_positive();
    });
  };

  this.buscarCliente = function () {
    modalBuscarPessoa.show($rootScope.categoriaPessoa.cliente.id).then(function (result) {
      self.documento.setCliente(new Pessoa(result));
      self.cdCliente = self.documento.cliente.codigo;
    });
  };

  this.buscarClientePorCodigo = function (codigo) {
    if (parseInt(codigo) == parseInt(this.documento.cliente.codigo)) {
      jQuery('#modalCliente').find('button[name="positive"]').trigger('click');
      return;
    }

    $rootScope.loading.load();
    providerPessoa.obterPessoaPorCodigo(codigo, $rootScope.categoriaPessoa.cliente.id).then(function (success) {
      self.documento.setCliente(new Pessoa(Pessoa.converterEmEntrada(success.data)));
      $rootScope.loading.unload();
    }, function (error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  };

  this.abrirModalPagamento = function (callback_positive, callback_negative) {
    jQuery('#modalPagamento').on('shown.bs.modal', function (e) {
      jQuery('input[name="cdPrazo"]').focus().select();
    }).modal('show').on('hidden.bs.modal', function (e) {
      if (callback_negative) callback_negative();
    }).find('.control button[name="positive"]').click(function () {
      if (callback_positive) callback_positive();
    });
  };

  this.buscarPrazo = function() {
    modalBuscarPrazo.show().then(function(result) {
      self.selectPrazo(new PrazoPagamento(result));
    });
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
    }, function (error)  {
      if (error.status == 404) {
        $rootScope.alerta.show('Não encontrado!');
      }
      console.log(error);
      $rootScope.loading.unload();
    });
  };

  this.buscarPrazoPorCodigo = function (codigo) {
    if (parseInt(codigo) == parseInt(this.documento.prazo.codigo) && validarFormas()) {
      jQuery('#modalPagamento').find('button[name="positive"]').trigger('click');
      return;
    }

    $rootScope.loading.load();
    providerPrazo.obterPorCodigo(codigo).then(function (success) {
      self.selectPrazo(new PrazoPagamento(PrazoPagamento.converterEmEntrada(success.data)));
      $rootScope.loading.unload();
    }, function (error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  };

  this.prepararPrazo = function (prazo) {
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
      self.documento.setPrazo(prazo);
      self.cdPrazo = self.documento.prazo.codigo;
      self.tempPrazo = new PrazoPagamento(self.documento.prazo);
      setParcelas();
    }
  };

  function setParcelas() {
    if (self.documento.pagamentos.length == self.documento.prazo.parcelas) {
      for (var i = 0; i < self.documento.prazo.parcelas; i++) {
        self.documento.pagamentos[i].valor = self.documento.getValorTotal() / self.documento.prazo.parcelas;
      }
    } else {
      self.documento.pagamentos = [];
      for (var i = 0; i < self.documento.prazo.parcelas; i++) {
        self.documento.pagamentos.push(new Pagamento());
        self.documento.pagamentos[i].valor = self.documento.getValorTotal() / self.documento.prazo.parcelas;
        self.documento.pagamentos[i].vencimento = getDataDaParcela(self.documento.prazo, i);
        self.documento.pagamentos[i].forma = self.documento.prazo.formas[0];
        self.documento.pagamentos[i].setForma();
      }
    }
  }

  this.abrirModalFuncionario = function (callback_positive, callback_negative) {
    jQuery('#modalFuncionario').on('shown.bs.modal', function (e) {
      jQuery('input[name="cdFuncionario"]').focus().select();
    }).modal('show').on('hidden.bs.modal', function (e) {
      if (callback_negative) callback_negative();
    }).find('.control button[name="positive"]').click(function () {
      if (callback_positive) callback_positive();
    });
  };

  this.buscarFuncionario = function () {
    modalBuscarPessoa.show($rootScope.categoriaPessoa.funcionario.id).then(function (result) {
      self.documento.setFuncionario(new Pessoa(result));
      self.cdFuncionario = self.documento.funcionario.codigo;
    });
  };

  this.buscarFuncionarioPorCodigo = function (codigo) {
    if (parseInt(codigo) == parseInt(this.documento.funcionario.codigo)) {
      jQuery('#modalFuncionario').find('button[name="positive"]').trigger('click');
      return;
    }

    $rootScope.loading.load();
    providerPessoa.obterPessoaPorCodigo(codigo, $rootScope.categoriaPessoa.funcionario.id).then(function (success) {
      self.documento.setFuncionario(new Pessoa(Pessoa.converterEmEntrada(success.data)));
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

  function validarFormas() {
    for (var i = 0; i < self.documento.pagamentos.length; i++) {
      if (!self.documento.pagamentos[i].formaId)
        return false;
    }

    return true;
  }

  this.prepararFechamento = function () {
    if (this.documento.trueLength() == 0) {
      $rootScope.alerta.show('A lista de produtos está vazia!');
      return;
    }

    modalConfirm.show('Aviso', 'Fechar a venda?').then(function() {
      self.validarModais();
    });
  };

  this.validarModais = function() {
    if (!self.documento.clienteId) {
      self.abrirModalCliente(self.validarModais);
      return;
    }

    if (!self.documento.prazoId || !validarFormas()) {
      self.abrirModalPagamento(self.validarModais);
      return;
    }

    if (!self.documento.codigo) {
      self.abrirModalFuncionario(self.fecharVenda);
    } else {
      self.fecharVenda();
    }
  };

  this.fecharVenda = function () {
    console.log('Saída', self.documento);
    console.log('Saída', Documento.converterEmSaida(self.documento));

    $scope.total_troco = 0;
    angular.forEach(self.documento.pagamentos, function(pagamento) {
      if (pagamento.forma.troco) {
        $scope.total_troco += pagamento.valor;
      }
    });

    if ($scope.total_troco > 0) {
      jQuery('#modalTroco').modal('show')
        .on('shown.bs.modal', function(e) {
          jQuery(this).find('input[name="dinheiro"]').focus().select();
        })
        .on('hidden.bs.modal', function (e) {
          post();
        });
    } else {
      post();
    }
  };

  function post() {
    $rootScope.loading.load();
    providerPDV.salvar(Documento.converterEmSaida(self.documento)).then(function (success) {
      console.log('submetido');
      $rootScope.loading.unload();
    }, function (error) {
      console.log(error);
      $rootScope.loading.unload();
      $rootScope.alerta.show('Não foi possível fechar a venda!', 'alert-danger');
    });
  }
}
