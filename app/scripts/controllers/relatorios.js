/**
 * Created by egmfilho on 14/03/17.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('RelatoriosCtrl', RelatoriosCtrl);

RelatoriosCtrl.$inject = [ '$rootScope', 'ProviderRelatorios', 'Relatorio', 'i18nService' ];

function RelatoriosCtrl($rootScope, provider, Relatorio, i18nService) {

  var self = this;

  this.opcao = 'financeiro';

  self.array = [];

  function obterRelatorios() {
    $rootScope.loading.load();
    provider.obterFinanceiro().then(function(success) {
      // var array = [];
      angular.forEach(success.data, function(item) {
        self.array.push(new Relatorio(Relatorio.converterEmEntrada(item)));
      });
      console.log(self.array);
      self.gridOptions.data = self.array;
      $rootScope.loading.unload();
    }, function(error) {
      console.log(error);
    });
  }

  obterRelatorios();

  self.gridOptions = {
    enableFiltering: true,
    treeRowHeaderAlwaysVisible: false,
    columnDefs: [
      {name:'documento.codigo', displayName:'Documento', groupingShowAggregationMenu:false},
      {name:'documento.data', displayName:'Data', cellFilter:'date:"dd/MM/yyyy"', groupingShowAggregationMenu:false},
      {name:'documento.prazo', displayName:'Prazo', groupingShowAggregationMenu:false},
      {name:'recebivel.forma', displayName:'Forma', groupingShowAggregationMenu:false},
      {name:'recebivel.valor', displayName:'Valor', cellFilter:'currency:"R$ "', groupingShowAggregationMenu:false},
      {name:'documento.usuario', displayName:'Usuário', groupingShowAggregationMenu:false},
      {name:'pessoa.nome', displayName:'Cliente', groupingShowAggregationMenu:false},
      {name:'recebivel.comissao', displayName:'Comissão', cellFilter:'currency:"R$ "', groupingShowAggregationMenu:false}
    ]
  };

  i18nService.setCurrentLang('pt-br');

}
