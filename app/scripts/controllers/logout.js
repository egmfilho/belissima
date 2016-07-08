/**
 * Created by egmfilho on 08/07/16.
 */
'use strict';

angular.module('belissimaApp')
  .controller('LogoutCtrl', ['$location', 'AuthenticationService', function($location, authentication) {

    authentication.logout(function(response) {
      console.log('logout');
      $location.path('/login');
    });

  }]);
