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
  'uiCalendarConfig'
];

function CalendarioCtrl($rootScope, $scope, $filter, $http, uiCalendarConfig) {

  var self = this,
      hoje = new Date();

  this.diasBloqueados = [
    { data: new Date('1901/12/24'), variavel: null }
  ];

  $scope.dummy = [];

  $scope.feriados = {
    estaduais: [ ], // dadosbr.github.io/feriados/estaduais/RJ.json
    nacionais: [ ]  // dadosbr.github.io/feriados/nacionais.json
  };

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
      variavel: variavel
    };
  }

  function obterFeriadosNacionais() {
    $rootScope.loading.load();
    $http.get('http://dadosbr.github.io/feriados/nacionais.json').then(function(success) {
      console.log('Nacionais', success.data);

      angular.forEach(success.data, function(item, index) {
        $scope.feriados.nacionais.push(formatFeriado(item));
      });
      self.diasBloqueados = self.diasBloqueados.concat($scope.feriados.nacionais);
      console.log(self.diasBloqueados);
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

      angular.forEach(success.data, function(item, index) {
        $scope.feriados.estaduais.push(formatFeriado(item));
      });
      self.diasBloqueados = self.diasBloqueados.concat($scope.feriados.estaduais);
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

  function isBloqueado(date) {
    return self.diasBloqueados.find(function(dia, index) {
      var d = dia.data ? new Date(dia.data) : (dia.variavel[hoje.getFullYear()] ? new Date(dia.variavel[hoje.getFullYear()]) : null);

      if (d == null) return null;

      if (d.getFullYear() == 1901) {
        d.setYear(new Date(date.format('YYYY/MM/DD')).getFullYear());
      }

      return compararMomentDate(date, d);
    }) != null;
  }

  function dayRender(date, cell) {
    if (isBloqueado(date)) {
      jQuery(cell).css('vertical-align', 'middle').append('<span class="glyphicon glyphicon-lock cadeado"></span>');
    }
  }

  function dayClick(date, jsEvent, view) {
    if (isBloqueado(date)) {
      self.diasBloqueados = self.diasBloqueados.filter(function(element) {
        return !compararMomentDate(date, element.data);
      });
    } else {
      self.diasBloqueados.push({ data: new Date(date.format('YYYY/MM/DD')) });
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
