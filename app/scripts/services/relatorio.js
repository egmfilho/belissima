/**
 * Created by egmfilho on 14/03/17.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('Relatorio', [function() {

    function Relatorio(relatorio) {
      this.documento = {
        codigo: relatorio ? relatorio.documento.codigo : '',
        prazo: relatorio ? relatorio.documento.prazo : '',
        data: relatorio ? relatorio.documento.data : new Date(),
        usuario: relatorio ? relatorio.documento.usuario : '',
        desconto: relatorio ? relatorio.documento.desconto : 0
      };

      this.recebivel = {
        codigo: relatorio ? relatorio.recebivel.codigo : '',
        forma: relatorio ? relatorio.recebivel.forma : '',
        comissao: relatorio ? relatorio.recebivel.comissao : 0,
        status: relatorio ? relatorio.recebivel.status : 'nenhum',
        valor: relatorio ? relatorio.recebivel.valor : 0
      };

      this.pessoa = {
        codigo: relatorio ? relatorio.pessoa.codigo : '',
        nome: relatorio ? relatorio.pessoa.nome : ''
      };
    }

    Relatorio.converterEmEntrada = function(report) {
      var relatorio = { };

      relatorio.documento = {
        codigo: report.document_code,
        prazo: report.document_payment_term_name,
        data: report.document_date,
        usuario: report.document_user_name,
        desconto: parseInt(report.document_total_descount)
      };

      relatorio.recebivel = {
        codigo: report.receivable_code,
        forma: report.receivable_payment_mode_name,
        comissao: parseInt(report.receivable_commision_value),
        status: report.receivable_status,
        valor: parseInt(report.receivable_value)
      };

      relatorio.pessoa = {
        codigo: report.person_code,
        nome: report.person_name
      };

      return relatorio;
    };

    return Relatorio;

  }]);
