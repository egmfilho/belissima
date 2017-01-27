/**
 * Created by egmfilho on 27/01/17.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('TabelaDesconto', TabelaDesconto);

function TabelaDesconto() {

  function TabelaDesconto(tabela) {
    this.ativo = tabela ? tabela.ativo : true;
    this.codigo = tabela ? tabela.codigo : '';
    this.data = tabela ? new Date(tabela.data) : null;
    this.default = tabela ? tabela.default : false;
    this.id = tabela ? tabela.id : '';
    this.maoDeObra = tabela ? tabela.maoDeObra : 0;
    this.casa = tabela ? tabela.casa : 0;
    this.nome = tabela ? tabela.nome : '';
    this.promocional = tabela ? tabela.promocional : false;
    this.dataUpdate = tabela ? new Date(tabela.dataUpdate) : null;
  }

  TabelaDesconto.converterEmEntrada = function(t) {
    var tabela = { };

    tabela.ativo = t.discount_table_active == 'Y';
    tabela.codigo = t.discount_table_code;
    tabela.data = new Date(t.discount_table_date);
    tabela.default = t.discount_table_default == 'Y';
    tabela.id = t.discount_table_id;
    tabela.maoDeObra = t.discount_table_manpower;
    tabela.casa = 100 - tabela.maoDeObra;
    tabela.nome = t.discount_table_name;
    tabela.promocional = t.discount_table_promotional == 'Y';
    tabela.dataUpdate = t.discount_table_update ? new Date(t.discount_table_update) : null;

    return tabela;
  };

  TabelaDesconto.converterEmSaida = function(tabela) {
    var t = { };

    t.discount_table_active = tabela.ativo ? 'Y' : 'N';
    t.discount_table_code = tabela.codigo;
    t.discount_table_default = tabela.default ? 'Y' : 'N';
    t.discount_table_id = tabela.id;
    t.discount_table_manpower = tabela.maoDeObra;
    t.discount_table_name = tabela.nome;
    t.discount_table_promotional = tabela.promocional ? 'Y' : 'N';

    return t;
  };

  return TabelaDesconto;

}
