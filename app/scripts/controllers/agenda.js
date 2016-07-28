/**
 * Created by egmfilho on 22/07/16.
 */
angular.module('belissimaApp')
  .controller('AgendaCtrl', [
    '$scope',
    '$compile',
    'uiCalendarConfig',
    '$uibModal',
    'ProviderTipoEvento',
    function($scope, $compile, uiCalendarConfig, $uibModal, ProviderTipoEvento) {

      var self = this,
          hoje = new Date();

      this.eventos = [{
        events: [
          {
            id: 1,
            title: 'Evento Teste',
            description: 'Primeiro teste de evento.',
            allDay: false,
            start: new Date(),
            end: new Date(),
            stick: true
          }, {
            id: 5,
            title: 'Evento Teste 5',
            description: 'Primeiro teste de evento.',
            allDay: false,
            start: new Date(),
            end: new Date(),
            stick: true
          }
        ],
        color: 'red',
        textColor: 'white',
      }, {
        events: [
          {
            id: 2,
            title: 'Evento Teste 2',
            description: 'Segundo teste de evento.',
            allDay: false,
            start: new Date(),
            end: new Date(),
            stick: true
          }, {
            id: 6,
            title: 'Evento Teste 6',
            description: 'Segundo teste de evento.',
            allDay: false,
            start: new Date(),
            end: new Date(),
            stick: true
          }
        ],
        color: 'blue',
        textColor: 'white'
      }, {
        events: [
          {
            id: 3,
            title: 'Evento Teste 3',
            description: 'Terceiro teste de evento.',
            allDay: false,
            start: new Date(),
            end: new Date(),
            stick: true
          }, {
            id: 4,
            title: 'Evento Teste 4',
            description: 'Terceiro teste de evento.',
            allDay: false,
            start: new Date(),
            end: new Date(),
            stick: true
          }
        ],
        color: 'green',
        textColor: 'white'
      }];

      $scope.uiConfig = {
        calendar: {
          height: 740,
          editable: true,
          eventLimit: true,
          customButtons: {
            addEvent: {
              text: 'Adicionar',
              click: novoEvento
            }
          },
          header: {
            left: 'addEvent today',
            center: 'prev title next',
            right: 'agendaDay,basicWeek,month'
          },
          buttonText: {
            today: 'Ver hoje'
          },
          eventLimitText: function(a) {
            return "+ " + a + " eventos";
          },
          defaultView: 'agendaDay',
          loading: loading,
          dayClick: dayClick,
          eventClick: eventClick,
          eventDrop: alertOnDrop,
          eventResize: alertOnResize,
          viewRender: alertOnChangeView,
          eventRender: eventRender
        }
      };

      function novoEvento() {
        console.log('Teste get tipo eventos');
        console.log(ProviderTipoEvento.obterTipoDeEventoPorId(1001));
      }

      function loading(isLoading, view) {

      }

      function dayClick(date, jsEvent, view) {
        //jsEvent.preventDefault();

        //$(this).css('background-color', 'red');

        if (view.name === 'month' || view.name === 'agendaWeek') {
          console.log(date._d);

          uiCalendarConfig.calendars.meuCalendario.fullCalendar('changeView', 'agendaDay');
          uiCalendarConfig.calendars.meuCalendario.fullCalendar('gotoDate', date);
        }
      }

      function eventClick(event, jsEvent, view) {
        $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalEvento.html',
          controller: 'ModalEventoCtrl',
          size: 'md',
          resolve: {
            evento: function() { return event; }
          }
        }).result.then(function(result) {
            angular.extend(event, result);
            uiCalendarConfig.calendars.meuCalendario.fullCalendar('refetchEvents');
          });
      }

      function alertOnDrop(event, delta, revertFunc, jsEvent, ui, view) {

      }

      function alertOnResize(e, delta, revertFunc, jsEvent, ui, view) {
        console.log();
      }

      function alertOnChangeView(view, element) {
        console.log("View Changed: ", view.visStart, view.visEnd, view.start, view.end);
      }

      function eventRender(event, element, view) {

        if (view.name === 'agendaDay') {
          element.css('max-width', '200px');

          //element.find('.fc-title').prepend("<span class='glyphicon glyphicon-tag'>&nbsp;</span>");
          element.find('.fc-title').append("<div><span style='font-size: 0.87em'>" + event.description + "</span></div>");
        } else {
          element.attr({'tooltip': event.description,
            'tooltip-append-to-body': true});
          $compile(element)($scope);
        }
      }

  }]);
