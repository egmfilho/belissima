/**
 * Created by egmfilho on 07/07/16.
 */

'use strict';

angular.module('belissimaApp')
  .factory('AuthenticationService', [
    '$http',
    '$httpParamSerializerJQLike',
    '$cookieStore',
    '$rootScope',
    'URLS',
    function($http, $httpParamSerializerJQLike, $cookieStore, $rootScope, URLS) {

      var service = {};

      service.login = Login;
      service.setCredentials = SetCredentials;
      service.clearCredentials = ClearCredentials;

      return service;

      function Login(username, password, callback) {

        $http({
          method: 'POST',
          url: URLS.login,
          data: $httpParamSerializerJQLike({ user: username, pass: password }),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
          callback(response);
        });

      }

      function SetCredentials(username, password) {
        var authdata = btoa(username + ':' + password);

        $rootScope.globals = {
          currentUser: {
            username: username,
            authdata: authdata
          }
        };

        $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
        $cookieStore.put('globals', $rootScope.globals);
      }

      function ClearCredentials() {
        $rootScope.globals = { };
        $cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic';
      }

    }]);
