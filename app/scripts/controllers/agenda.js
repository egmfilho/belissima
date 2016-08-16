/**
 * Created by egmfilho on 22/07/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('AgendaCtrl', [
    '$rootScope',
    '$scope',
    '$compile',
    'uiCalendarConfig',
    '$uibModal',
    'ProviderEvento',
    'ProviderPessoa',
    'Evento',
    'Pessoa',
    'ModalConfirm',
    function($rootScope, $scope, $compile, uiCalendarConfig, $uibModal, providerEvento, providerPessoa, Evento, Pessoa, modalConfirm) {

      var self = this;

      this.eventos = [ ];
      this.funcionarios = [ ];

      $scope.uiConfig = {
        calendar: {
          timezone: 'local',
          allDaySlot: false,
          height: 740,
          editable: true,
          resources: self.funcionarios,
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
            right: 'agendaDay,basicWeek,month,'
          },
          buttonText: {
            today: 'Ver hoje'
          },
          eventLimitText: function(n) {
            return "+ " + n + " eventos";
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

      function getFuncionarios() {
        if (!$rootScope.categoriaPessoa) return;
        providerPessoa.obterPessoasPorCategoria($rootScope.categoriaPessoa.funcionario).then(function(success) {
          angular.forEach(success.data, function(item, index) {
            var pessoa = new Pessoa(Pessoa.converterEmEntrada(item));
            self.funcionarios.push({ id: pessoa.id, title: (pessoa.apelido || pessoa.nome) });
          });
        }, function(error) {
          console.log(error);
        });
      }

      function getEventos() {
        providerEvento.obterEventos(true).then(function(success) {
          self.eventos.push({ events: [ ]});

          angular.forEach(success.data, function(item, index) {
            self.eventos[0].events.push(new Evento(Evento.converterEmEntrada(item)));
          });

        }, function(error) {
          console.log(error.data);
        });
      }

      $scope.$on('$viewContentLoaded', function() {
        getFuncionarios();
        getEventos();
      });

      function atualizarEvento(evento) {
        return providerEvento.atualizarEvento(Evento.converterEmSaida(evento));
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
              $rootScope.isLoading = true;
              providerEvento.salvarEvento(Evento.converterEmSaida(result)).then(function(success) {
                self.eventos.push(new Evento(Evento.converterEmEntrada(success.data)));
                uiCalendarConfig.calendars.meuCalendario.fullCalendar('renderEvent', self.eventos[self.eventos.length - 1], true);
                $rootScope.isLoading = false;
              }, function(error) {
                console.log(error);
                $rootScope.isLoading = false;
                alert('Nao salvo');
              });
            }
        });
      }

      function loading(isLoading, view) {
        $rootScope.isLoading = isLoading;
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
        return providerEvento.obterEventoPorId(id, true, true, true, true, true, true, true).then(function(success) {
          return new Evento(Evento.converterEmEntrada(success.data));
        }, function(error) {
          console.log(error);
          return null;
        });
      }

      function apagarEvento(evento) {
        $rootScope.isLoading = true;
        providerEvento.apagarEvento(evento.id).then(function(success) {
          uiCalendarConfig.calendars.meuCalendario.fullCalendar('removeEvents', evento._id);
          $rootScope.isLoading = false;
          alert('apagado');
        }, function(error) {
          $rootScope.isLoading = false;
          alert('nao apagado');
        });
      }

      function eventClick(event, jsEvent, view) {
        $rootScope.isLoading = true;
        getEventoCompleto(event.id).then(function(fullevent) {
          $rootScope.isLoading = false;
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
                $rootScope.isLoading = true;
                atualizarEvento(result).then(function(success) {
                  angular.extend(event, result);
                  uiCalendarConfig.calendars.meuCalendario.fullCalendar('updateEvent', event);
                  $rootScope.isLoading = false;
                  alert('atualizado');
                }, function(error) {
                  console.log(error);
                  $rootScope.isLoading = false;
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
            $rootScope.isLoading = true;
            if (event.funcionarioId != event.resourceId) {
              event.funcionarioId = event.resourceId;
            }
            atualizarEvento(event).then(function(success) {
              $rootScope.isLoading = false;
              alert('atualizado');
            }, function(error) {
              console.log(error);
              revertFunc();
              $rootScope.isLoading = false;
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
          element.css('max-width', '250px');

          //element.find('.fc-title').prepend("<span class='glyphicon glyphicon-tag'>&nbsp;</span>");
          element.find('.fc-title').append("<div><span style='font-size: 0.87em'>" + event.description + "</span></div>");
        } else {
          element.attr({'tooltip': event.description,
            'tooltip-append-to-body': true});
          $compile(element)($scope);
        }
      }

  }]);
