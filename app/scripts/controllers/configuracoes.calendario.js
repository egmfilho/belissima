/**
 * Created by egmfilho on 02/12/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('CalendarioCtrl', CalendarioCtrl);

CalendarioCtrl.$inject = [
  '$rootScope',
  '$scope',
  '$filter',
  '$http',
  'Feriado',
  'uiCalendarConfig'
];

function CalendarioCtrl($rootScope, $scope, $filter, $http, Feriado, uiCalendarConfig) {

  var self = this,
      hoje = new Date();

  this.feriados = [
    { data: new Date('1901/12/24'), variavel: null, titulo: 'Véspera de Natal' }
  ];

  this.diasBloqueados = [ ];

  $scope.dummy = [];

  $scope.temp = new Feriado();

  $scope.uiConfig = {
    calendar: {
      timezone: 'local',
      height: 740,
      navLinks: true,
      header: {
        left: '',
        center: 'prev title next',
        right: ''
      },
      defaultView: 'month',
      dayRender: dayRender,
      dayClick: dayClick
    }
  };

  function formatFeriado(feriado) {
    var variavel = {};

    if (!feriado.date) {
      angular.forEach(feriado.variableDates, function(value, key) {
        variavel[key] = new Date(key + '/' + value.split('/')[1] + '/' + value.split('/')[0]);
      });
    }

    return {
      data: feriado.date ? new Date('1901/' + feriado.date.split('/')[1] + '/' + feriado.date.split('/')[0]) : null,
      variavel: variavel,
      titulo: feriado.title,
      descricao: feriado.description
    };
  }

  function obterFeriadosNacionais() {
    $rootScope.loading.load();
    $http.get('http://dadosbr.github.io/feriados/nacionais.json').then(function(success) {
      console.log('Nacionais', success.data);
      var nacionais = [];
      angular.forEach(success.data, function(item, index) {
        nacionais.push(new Feriado(Feriado.converterEmEntrada(item)));
      });
      self.feriados = self.feriados.concat(nacionais);
      console.log(self.feriados);
      refreshCalendar();
      $rootScope.loading.unload();
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  }

  obterFeriadosNacionais();
  obterFeriadosEstaduais();

  function obterFeriadosEstaduais() {
    $rootScope.loading.load();
    $http.get('http://dadosbr.github.io/feriados/estaduais/RJ.json').then(function(success) {
      console.log('Estaduais', success.data);
      var estaduais = [];
      angular.forEach(success.data, function(item, index) {
        estaduais.push(new Feriado(Feriado.converterEmEntrada(item)));
      });
      self.feriados = self.feriados.concat(estaduais);
      refreshCalendar();
      $rootScope.loading.unload();
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  }

  function compararMomentDate(moment, date) {
    return moment.format('YYYY/MM/DD') === $filter('date')(date, 'yyyy/MM/dd');
  }

  function isFeriado(date) {
    return self.feriados.find(function(dia, index) {
      var d = dia.data ? new Date(dia.data) : (dia.variavel[hoje.getFullYear()] ? new Date(dia.variavel[hoje.getFullYear()]) : null);

      if (d == null) return null;

      if (d.getFullYear() == 1901) {
        d.setYear(new Date(date.format('YYYY/MM/DD')).getFullYear());
      }

      return compararMomentDate(date, d);
    });
  }

  function dayRender(date, cell) {
    var feriado = isFeriado(date);

    if (feriado) {
      jQuery(cell).css('vertical-align', 'middle').append('<span class="glyphicon glyphicon-calendar cadeado"></span><br><h6 class="text-center">' + feriado.titulo + '</h6>');
    }
  }

  function dayClick(date, jsEvent, view) {
    $scope.temp.data = new Date(date.format('YYYY/MM/DD'));
    jQuery('#modalFeriado').modal('show');
    return;

    if (isBloqueado(date)) {
      self.feriados = self.feriados.filter(function(element) {
        return !compararMomentDate(date, element.data);
      });
    } else {
      self.feriados.push({ data: new Date(date.format('YYYY/MM/DD')) });
    }

    refreshCalendar();

    jsEvent.preventDefault();
  }

  function refreshCalendar() {
    // para dar refresh na view
    uiCalendarConfig.calendars.calendarioFeriados.fullCalendar('prev');
    uiCalendarConfig.calendars.calendarioFeriados.fullCalendar('next');
  }
}
