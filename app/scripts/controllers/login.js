/**
 * Created by egmfilho on 21/06/16.
 */
'use strict';

angular.module('belissimaApp.controllers')
  .controller('LoginCtrl', ['$scope', '$location', 'AuthenticationService', function ($scope, $location, authentication) {

    this.logar = function() {
      authentication.login(this.username, this.password, function(response) {
        $location.path('#/home');
      });
    };

  }]);
