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
    'ModalConfirm',
    function($scope, $compile, uiCalendarConfig, $uibModal, provider, Evento, modalConfirm) {

      var self = this;

      this.eventos = [ ];

      $scope.uiConfig = {
        calendar: {
          timezone: 'local',
          allDaySlot: false,
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
          eventDrop: alertOnResizeOrDrop,
          eventResize: alertOnResizeOrDrop,
          viewRender: alertOnChangeView,
          eventRender: eventRender
        }
      };

      function getEventos() {
        provider.obterEventos(true).then(function(success) {
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

      function atualizarEvento(evento) {
        return provider.atualizarEvento(Evento.converterEmSaida(evento));
      }

      function novoEvento() {
        $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalEvento.html',
          controller: 'ModalEventoCtrl',
          size: 'lg',
          resolve: {
            evento: function() { return null; }
          }
        }).result.then(function(result) {
            if (result) {
              console.log('POST', Evento.converterEmSaida(result));

              provider.salvarEvento(Evento.converterEmSaida(result)).then(function(success) {
                self.eventos.push(result);
                uiCalendarConfig.calendars.meuCalendario.fullCalendar('renderEvent', self.eventos[self.eventos.length - 1], true);
              }, function(error) {
                console.log(error);
                alert('Nao salvo');
              });
            }
        });
      }

      function loading(isLoading, view) {

      }

      function dayClick(date, jsEvent, view) {
        //jsEvent.preventDefault();

        //$(this).css('background-color', 'red');

        if (view.name === 'month' || view.name === 'basicWeek') {
          uiCalendarConfig.calendars.meuCalendario.fullCalendar('changeView', 'agendaDay');
          uiCalendarConfig.calendars.meuCalendario.fullCalendar('gotoDate', date);
        }
      }

      function getEventoCompleto(id) {
        return provider.obterEventoPorId(id, true, true, true, true, true, true, true).then(function(success) {
          return new Evento(Evento.converterEmEntrada(success.data));
        }, function(error) {
          console.log(error);
          return null;
        });
      }

      function apagarEvento(evento) {
        provider.apagarEvento(evento.id).then(function(success) {
          uiCalendarConfig.calendars.meuCalendario.fullCalendar('removeEvents', evento._id);
          alert('apagado');
        }, function(error) {
          alert('nao apagado');
        });
      }

      function eventClick(event, jsEvent, view) {
        getEventoCompleto(event.id).then(function(fullevent) {
          $uibModal.open({
            animation: true,
            templateUrl: 'partials/modalEvento.html',
            controller: 'ModalEventoCtrl',
            size: 'lg',
            resolve: {
              evento: function() { return fullevent; }
            }
          }).result.then(function(result) {
            if (!angular.equals(fullevent, result)) {
              if (result === 'excluir') {
                apagarEvento(event);
              } else {
                atualizarEvento(result).then(function(success) {
                  angular.extend(event, result);
                  uiCalendarConfig.calendars.meuCalendario.fullCalendar('updateEvent', event);
                  alert('atualizado');
                }, function(error) {
                  console.log(error);
                  alert('nao atualizado');
                });
              }
            }
          });
        });
      }

      function alertOnResizeOrDrop(event, delta, revertFunc, jsEvent, ui, view) {
        modalConfirm.show('Aviso', 'Salvar as alterações?', 'Sim', 'Não', function(result) {
          if (result) {
            atualizarEvento(event).then(function(success) {
              alert('atualizado');
            }, function(error) {
              console.log(error);
              revertFunc();
              alert('nao atualizado');
            });
          } else {
            revertFunc();
          }
        });
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
