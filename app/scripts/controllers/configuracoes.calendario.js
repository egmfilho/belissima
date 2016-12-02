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
  'uiCalendarConfig'
];

function CalendarioCtrl($rootScope, $scope, $filter, uiCalendarConfig) {

  var self = this;

  this.diasBloqueados = [
    new Date('2016/12/25')
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

  function compararMomentDate(moment, date) {
    return moment.format('YYYY-MM-DD') === $filter('date')(date, 'yyyy-MM-dd');
  }

  function isBloqueado(date) {
    return self.diasBloqueados.find(function(dia, index) {
      return compararMomentDate(date, dia);
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
        return !compararMomentDate(date, element);
      });
    } else {
      self.diasBloqueados.push(new Date(date.format('YYYY/MM/DD')));
    }

    // da refresh na view
    uiCalendarConfig.calendars.calendarioFeriados.fullCalendar('prev');
    uiCalendarConfig.calendars.calendarioFeriados.fullCalendar('next');

    jsEvent.preventDefault();
  }
}
