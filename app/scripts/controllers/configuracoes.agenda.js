/**
 * Created by egmfilho on 24/01/17.
 */

angular.module('belissimaApp.controllers')
  .controller('ConfigAgendaCtrl', ConfigAgendaCtrl);

ConfigAgendaCtrl.$inject = [ '$rootScope', 'ProviderConfig' ];

function ConfigAgendaCtrl($rootScope, provider) {

  function setView(value) {
    $rootScope.loading.load();
    provider.setViewAgenda(value).then(function(success) {
      if (value == 'timelineDay') {
        jQuery('.timeline-day').addClass('active');
        jQuery('.agenda-day').removeClass('active');
      } else if (value == 'agendaDay') {
        jQuery('.timeline-day').removeClass('active');
        jQuery('.agenda-day').addClass('active');
      }
      $rootScope.alerta.show('Visualização alterada!', 'alert-success');
      $rootScope.loading.unload();
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
    });
  }

  function getView() {
    $rootScope.loading.load();
    provider.getViewAgenda().then(function(success) {
      if (success.data.agenda_view == 'timelineDay') {
        jQuery('.timeline-day').addClass('active');
        jQuery('.agenda-day').removeClass('active');
      } else if (success.data.agenda_view == 'agendaDay') {
        jQuery('.timeline-day').removeClass('active');
        jQuery('.agenda-day').addClass('active');
      }
      $rootScope.loading.unload();
    }, function(res) {
      $rootScope.loading.unload();
    });
  }

  this.click = function(name) {
    setView(name);
  };

  getView();
}
