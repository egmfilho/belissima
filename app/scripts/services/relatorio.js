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
        usuario: relatorio ? relatorio.documento.usuario : ''
      };

      this.recebivel = {
        codigo: relatorio ? relatorio.recebivel.codigo : '',
        forma: relatorio ? relatorio.recebivel.forma : '',
        comissao: relatorio ? relatorio.recebivel.comissao : 0,
        status: relatorio ? relatorio.recebivel.status : 'nenhum',
        statusComissao: relatorio ? relatorio.recebivel.statusComissao : 'nenhum',
        valor: relatorio ? relatorio.recebivel.valor : 0
      };

      this.pessoa = {
        codigo: relatorio ? relatorio.pessoa.codigo : '',
        nome: relatorio ? relatorio.pessoa.nome : ''
      };
    }

    Relatorio.prototype = {
      achatar: function() {
        return {
          codigo_documento: this.documento.codigo,
          prazo: this.documento.prazo,
          data: this.documento.data,
          usuario: this.documento.usuario,
          codigo_recebivel: this.recebivel.codigo,
          forma: this.recebivel.forma,
          comissao: this.recebivel.comissao,
          status_comissao: this.recebivel.statusComissao,
          valor: this.recebivel.valor,
          codigo_pessoa: this.pessoa.codigo,
          nome_pessoa: this.pessoa.nome
        }
      }
    };

    Relatorio.converterEmEntrada = function(report) {
      var relatorio = { };

      relatorio.documento = {
        codigo: report.document_code,
        prazo: report.payment_term_description,
        data: new Date(report.document_date),
        usuario: report.user_name
      };

      relatorio.recebivel = {
        codigo: report.receivable_code,
        forma: report.payment_mode_description,
        comissao: parseInt(report.comission_value_total || 0),
        statusComissao: report.comission_status || 'indefinido',
        status: report.receivable_status,
        valor: parseInt(report.receivable_value || 0)
      };

      relatorio.pessoa = {
        codigo: report.person_code,
        nome: report.person_name
      };

      return relatorio;
    };

    return Relatorio;

  }]);
