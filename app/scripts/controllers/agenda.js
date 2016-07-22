/**
 * Created by egmfilho on 22/07/16.
 */
angular.module('belissimaApp')
  .controller('AgendaCtrl', ['$scope', function($scope) {

    var hoje = new Date();

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
        }
      ],
      color: 'red',
      textColor: 'white'
    },{
      events: [
        {
          id: 2,
          title: 'Evento Teste 2',
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
      //url: "https://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic"
    }, function(start, end, timezone, callback) {

    }];

    $scope.uiConfig = {
      calendar:{
        height: 740,
        editable: true,
        header:{
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: alertEventOnClick,
        eventDrop: alertOnDrop,
        eventResize: alertOnResize,
        viewRender: alertOnChangeView
      }
    };

    function alertEventOnClick(date, jsEvent, view) {

    }

    function alertOnDrop(event, delta, revertFunc, jsEvent, ui, view) {

    }

    function alertOnResize(e, delta, revertFunc, jsEvent, ui, view) {
      console.log();
    }

    function alertOnChangeView(view, element) {
      console.log("View Changed: ", view.visStart, view.visEnd, view.start, view.end);
    }

  }]);
