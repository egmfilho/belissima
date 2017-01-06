/**
 * Created by egmfilho on 22/07/16.
 */

'use strict';

angular.module('belissimaApp.controllers')
  .controller('AgendaCtrl', [
    '$rootScope',
    '$scope',
    '$timeout',
    '$document',
    '$compile',
    '$filter',
    'uiCalendarConfig',
    '$uibModal',
    'ProviderEvento',
    'ProviderPessoa',
    'Evento',
    'Pessoa',
    'ModalConfirm',
    'ModalAlert',
    'DataSaida',
    function($rootScope, $scope, $timeout, $document, $compile, $filter, uiCalendarConfig, $uibModal, providerEvento, providerPessoa, Evento, Pessoa, modalConfirm, modalAlert, DataSaida) {

      var self = this;

      this.dias = [
        // new Date('2016/11/28'),
        // new Date('2016/12/5'),
        // new Date('2016/12/12'),
        // new Date('2016/12/19'),
        // new Date('2016/12/26'),
        // new Date('2017/01/02')
      ];

      this.currentView = 'month';
      this.currentDate = new Date();

      this.eventos = {
        array: [ ],
        inicio: null,
        fim: null
      };

      this.funcionarios = [ ];
      this.mobile = {
        funcionarios: []
      };

      this.intervalos = [
        { value: 0, as: '05 minutos' },
        { value: 1, as: '10 minutos' },
        { value: 2, as: '15 minutos' },
        { value: 3, as: '30 minutos' }
      ];
      $scope.option = this.intervalos[2].value;

      $scope.$on('$viewContentLoaded', function() {
        // jQuery($document).on('click', 'button.fc-button', function() {
        //   $rootScope.loading.load();
        // });

        getFuncionarios();
      });

      $scope.uiConfig = {
        calendar: {
          timezone: 'local',
          allDaySlot: false,
          height: 740,
          editable: true,
          resources: self.funcionarios,
          eventLimit: true,
          navLinks: true,
          // customButtons: {
          //   addEvent: {
          //     text: 'Adicionar',
          //     click: novoEvento
          //   }
          // },
          header: {
            left: '',// 'addEvent today',
            center: 'prev title next',
            right: ''// 'timelineDay,basicWeek,month,'
          },
          // buttonText: {
          //   today: 'Ver hoje'
          // },
          eventLimitText: function(n) {
            return "+ " + n + " eventos";
          },
          defaultView: 'month',
          slotDuration: '00:15:00',
          slotLabelFormat: 'HH:mm',
          timeFormat: 'HH:mm',
          slotEventOverlap: false,
          resourceAreaWidth: '20%',
          resourceLabelText: 'Funcionários',
          slotWidth: 40,
          eventAfterAllRender: afterRender,
          dayClick: dayClick,
          eventClick: eventClick,
          eventDrop: alertOnResizeOrDrop,
          eventResize: alertOnResizeOrDrop,
          viewRender: alertOnChangeView,
          dayRender: dayRender,
          eventRender: eventRender,
          scrollTime: getNow(),
          nowIndicator: true
        }
      };

      function getNow() {
        var currentTime = new Date();

        return Math.max(currentTime.getHours() - 1, 0) + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds();
      }

      function getFuncionarios() {
        if (!$rootScope.categoriaPessoa) return;
        $rootScope.loading.load();
        providerPessoa.obterPessoasPorCategoria($rootScope.categoriaPessoa.funcionario.id).then(function(success) {
          self.funcionarios.push({ id: -1, title: 'Todos'});
          angular.forEach(success.data, function(item, index) {
            var pessoa = new Pessoa(Pessoa.converterEmEntrada(item));
            self.mobile.funcionarios.push(pessoa);
            self.funcionarios.push({ id: pessoa.id, title: (pessoa.apelido || pessoa.nome) });
          });
          $rootScope.loading.unload();
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getEventos(inicio, fim) {
        inicio.setHours(0);
        inicio.setMinutes(0);
        inicio.setSeconds(0);
        fim.setHours(23);
        fim.setMinutes(59);
        fim.setSeconds(59);

        if (self.eventos.inicio && self.eventos.fim) {
          if (inicio >= self.eventos.inicio && fim <= self.eventos.fim) {
            return;
          }

          if (inicio < self.eventos.inicio && fim > self.eventos.inicio) {
            fim = self.eventos.inicio;
          } else if (fim > self.eventos.fim && inicio < self.eventos.fim) {
            inicio = self.eventos.fim;
          }
        } else {
          self.eventos.inicio = new Date(inicio);
          self.eventos.fim = new Date(fim);
        }

        $rootScope.loading.load();
        providerEvento.obterEventos(true, DataSaida.converter(inicio), DataSaida.converter(fim)).then(function(success) {
          if (success.data.length) {
            self.eventos.array.push({events: []});
            angular.forEach(success.data, function (item, index) {
              var evento = new Evento(Evento.converterEmEntrada(item));
              evento.start.setSeconds(1);
              evento.end.setSeconds(0);
              self.eventos.array[self.eventos.array.length - 1].events.push(evento);
            });
            if (inicio < self.eventos.inicio) {
              self.eventos.inicio = inicio;
            }

            if (fim > self.eventos.fim) {
              self.eventos.fim = fim;
            }
          }
          $rootScope.loading.unload();
        }, function(error) {
          console.log(error.data);
          $rootScope.loading.unload();
        });
      }

      function atualizarEvento(evento) {
        return providerEvento.atualizarEvento(Evento.converterEmSaida(evento));
      }

      this.novoEvento = function() {
        if (self.currentView === 'timelineDay' && !validarDiaParaAgendamento(self.currentDate)) {
          modalAlert.show('Aviso!', 'Dia indisponível para agendamentos!');
          return;
        }

        $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalEvento.html',
          controller: 'ModalEventoCtrl',
          size: 'lg',
          resolve: {
            evento: function() { return null; },
            data: function() { return self.currentView === 'timelineDay' ? new Date(self.currentDate.format('YYYY/MM/DD')) : null; }
          }
        }).result.then(function(result) {
          console.log(result);
          if (result.length) {
            if (result.length) {
              angular.forEach(result, function(item, index) {
                self.eventos.array.push(new Evento(item));
                uiCalendarConfig.calendars.meuCalendario.fullCalendar('renderEvent', self.eventos.array[self.eventos.array.length - 1], true);
              });
              uiCalendarConfig.calendars.meuCalendario.fullCalendar('renderEvents');
            }
          }
        });
      };

      function dayClick(date, jsEvent, view) {
        if (!validarDiaParaAgendamento(date)) {
          modalAlert.show('Aviso!', 'Dia indisponível para agendamentos!');
          return;
        }

        //jsEvent.preventDefault();

        //$(this).css('background-color', 'red');

        if (view.name === 'month' || view.name === 'basicWeek') {
          uiCalendarConfig.calendars.meuCalendario.fullCalendar('changeView', 'timelineDay');
          uiCalendarConfig.calendars.meuCalendario.fullCalendar('gotoDate', date);
        }
      }

      function getEventoCompleto(id) {
        $rootScope.loading.load();
        return providerEvento.obterEventoPorId(id, true, true, true, true, true, true, true).then(function(success) {
          $rootScope.loading.unload();
          return new Evento(Evento.converterEmEntrada(success.data));
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
          return null;
        });
      }

      function apagarEvento(evento) {
        $rootScope.loading.load();
        providerEvento.apagarEvento(evento.id).then(function(success) {
          uiCalendarConfig.calendars.meuCalendario.fullCalendar('removeEvents', evento._id);
          $rootScope.loading.unload();
          modalAlert.show(null, 'Evento excluído!');
        }, function(error) {
          $rootScope.loading.unload();
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
              evento: function() { return fullevent; },
              data: function() { return null; }
            }
          }).result.then(function(result) {
            if (!angular.equals(fullevent, result)) {
              if (result === 'excluir') {
                apagarEvento(event);
              } else {
                if (result.length) {
                  if (result.length) {
                    angular.forEach(result, function(item, index) {
                      if (index == 0) {
                        angular.extend(event, item);
                        uiCalendarConfig.calendars.meuCalendario.fullCalendar('updateEvent', event);
                      } else {
                        self.eventos.array.push(new Evento(item));
                        uiCalendarConfig.calendars.meuCalendario.fullCalendar('renderEvent', self.eventos.array[self.eventos.array.length - 1], true);
                      }
                    });
                    uiCalendarConfig.calendars.meuCalendario.fullCalendar('renderEvents');
                  }
                }
              }
            }
          });
        });
      }

      function alertOnResizeOrDrop(event, delta, revertFunc, jsEvent, ui, view) {
        modalConfirm.show(null, 'Salvar as alterações?', 'Sim', 'Não').then(function() {
          $rootScope.loading.load();
          if (event.funcionarioId != event.resourceId) {
            event.funcionarioId = event.resourceId;
          }
          atualizarEvento(event).then(function(success) {
            $rootScope.loading.unload();
          }, function(error) {
            console.log(error);
            revertFunc();
            $rootScope.loading.unload();
            if (error.status == 420) {
              modalAlert.show('Falha', 'Já existe um evento neste horário!');
            }
          });
        }, function() {
          revertFunc();
        });
      }

      function alertOnChangeView(view, element) {
        // pega a data exibida na tela na visualizacao de dia
        if (view.name === 'timelineDay') {
          self.currentDate = uiCalendarConfig.calendars.meuCalendario.fullCalendar('getDate');
        }

        self.currentView = view.name;
        // console.log("View Changed: ", view.start._d, view.end._d);
        $rootScope.loading.load();
        getEventos(view.start._d, view.end._d);
      }

      function afterRender(view) {
        $rootScope.loading.unload();
      }

      function eventRender(event, element, view) {

        if (view.name === 'timelineDay') {
          // element.css('max-width', '250px');

          element.find('.fc-title').append("<br><div><span style='font-size: 0.87em'>" + event.description + "</span></div>");
        } else {
          element.attr({'tooltip': event.description,
            'tooltip-append-to-body': true});
          $compile(element)($scope);
        }
      }

      function dayRender(date, cell) {
        if (!validarDiaParaAgendamento(date)) {
          jQuery(cell).css('vertical-align', 'middle').append('<span class="glyphicon glyphicon-lock cadeado"></span>');
        }
      }

      this.verHoje = function() {
        uiCalendarConfig.calendars.meuCalendario.fullCalendar('today');
      };

      this.mudarIntervalo = function(option) {
        switch (option) {
          case 0:
            uiCalendarConfig.calendars.meuCalendario.fullCalendar('option', 'slotDuration', '00:05:00');
            break;
          case 1:
            uiCalendarConfig.calendars.meuCalendario.fullCalendar('option', 'slotDuration', '00:10:00');
            break;
          case 2:
            uiCalendarConfig.calendars.meuCalendario.fullCalendar('option', 'slotDuration', '00:15:00');
            break;
          case 3:
            uiCalendarConfig.calendars.meuCalendario.fullCalendar('option', 'slotDuration', '00:30:00');
            break;
        }
      };

      this.dia = function() {
        uiCalendarConfig.calendars.meuCalendario.fullCalendar('changeView', 'timelineDay');
      };

      this.semana = function() {
        uiCalendarConfig.calendars.meuCalendario.fullCalendar('changeView', 'basicWeek');
      };

      this.mes = function() {
        uiCalendarConfig.calendars.meuCalendario.fullCalendar('changeView', 'month');
      };

      function compararMomentDate(moment, date) {
        return moment.format('YYYY-MM-DD') === $filter('date')(date, 'yyyy-MM-dd');
      }

      function validarDiaParaAgendamento(date) {
        return self.dias.find(function (dia, index) {
            return compararMomentDate(date, dia);
          }) == null;
      }

  }]);
