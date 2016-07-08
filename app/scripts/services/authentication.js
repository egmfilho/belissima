/**
 * Created by egmfilho on 07/07/16.
 */

'use strict';

angular.module('belissimaApp')
  .factory('AuthenticationService', [
    '$http',
    '$httpParamSerializerJQLike',
    '$cookieStore',
    'URLS',
    function($http, $httpParamSerializerJQLike, $cookieStore, URLS) {

      var service = {};

      service.login = Login;
      service.logout = Logout;
      //service.setCredentials = SetCredentials;
      //service.clearCredentials = ClearCredentials;

      return service;

      function Login(username, password, callback) {

        $http({
          method: 'POST',
          url: URLS.login,
          data: $httpParamSerializerJQLike({ user: username, pass: password }),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
          console.log(response);
          SetCredentials(response.data.user_session_id);
          callback(response);
        });

      }

      function Logout(callback) {

        var token = $cookieStore.get('currentUser') ? $cookieStore.get('currentUser').token : '';

        $http({
          method: 'POST',
          url: URLS.logout,
          data: $httpParamSerializerJQLike({ token: token }),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
          ClearCredentials();
          callback(response);
        });

      }

      function SetCredentials(token) {
        var currentUser = { token: token };

        $http.defaults.headers.common['user-session-id'] = token;
        $cookieStore.put('currentUser', currentUser);
      }

      function ClearCredentials() {
        $cookieStore.remove('currentUser');
        $http.defaults.headers.common.Authorization = 'Basic';
      }

    }]);
