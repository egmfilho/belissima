/**
 * Created by egmfilho on 22/07/16.
 */
angular.module('belissimaApp')
  .controller('AgendaCtrl', [
    '$scope',
    '$compile',
    'uiCalendarConfig',
    '$uibModal',
    'ProviderEvento',
    'Evento',
    function($scope, $compile, uiCalendarConfig, $uibModal, provider, Evento) {

      var self = this,
          start = new Date(),
          end = new Date();

      end.setHours(start.getHours() + 2);

      this.eventos = [ ];

      $scope.uiConfig = {
        calendar: {
          timezone: 'local',
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

      function getEventos() {
        provider.obterEventos().then(function(success) {
          self.eventos.push({ events: [ ]});

          angular.forEach(success.data, function(item, index) {
            self.eventos[0].events.push(new Evento(Evento.converterEmEntrada(item)));
          });

        }, function(error) {
          console.log(error.data);
        });
      }

      $scope.$on('$viewContentLoaded', function() {
        getEventos();
      });

      function novoEvento() {
        console.log('Adicionar evento');
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
            uiCalendarConfig.calendars.meuCalendario.fullCalendar('updateEvent', event);
          });
        console.log(self.eventos);
      }

      function alertOnDrop(event, delta, revertFunc, jsEvent, ui, view) {

      }

      function alertOnResize(event, delta, revertFunc, jsEvent, ui, view) {
        console.log();
      }

      function alertOnChangeView(view, element) {
        //console.log("View Changed: ", view.visStart, view.visEnd, view.start, view.end);
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
