/**
 * Created by egmfilho on 21/06/16.
 */
'use strict';

angular.module('belissimaApp')
  .controller('LoginCtrl', ['$scope', '$location', 'AuthenticationService', function ($scope, $location, authentication) {

    var self = this;

    if (confirm('logout?')) {
      authentication.clearCredentials();
    }

    this.logar = function() {
      authentication.login(this.username, this.password, function(response) {
        authentication.setCredentials(self.username, self.password);
        $location.path('#/home');
      });
    };

  }]);
