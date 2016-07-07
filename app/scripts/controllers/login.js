/**
 * Created by egmfilho on 21/06/16.
 */
'use strict';

angular.module('belissimaApp')
  .controller('LoginCtrl', ['$scope', 'AuthenticationService', function ($scope, authentication) {

    this.logar = function() {
      authentication.login(this.username, this.password, function(response) {
        console.log('Server response: ' + JSON.stringify(response));
      });

      //authentication.login($scope.modal.element.find('form').serialize(), function(response) {
      //  console.log('Server response: ' + JSON.stringify(response));
      //})
    };

  }]);
