/**
 * Created by egmfilho on 07/07/16.
 */

'use strict';

angular.module('belissimaApp')
  .factory('AuthenticationService', [
    '$http',
    '$httpParamSerializerJQLike',
    '$cookies',
    'URLS',
    function($http, $httpParamSerializerJQLike, $cookies, URLS) {

      var service = {};

      service.login = Login;
      service.logout = Logout;
      //service.setCredentials = SetCredentials;
      //service.clearCredentials = ClearCredentials;

      return service;

      function Login(username, password, callback) {

        $http({
          method: 'POST',
          url: URLS.root + 'login.php',
          data: { user: username, pass: password }
        }).then(function(success) {
          var response = success.data;
          //console.log(success.headers('Set-Cookie'));
          //console.log(success.headers());
          //console.log($cookies.get('PHPSESSID'));

          switch (response.status.code) {
            case 404:
              console.log('Usuário não encontrado');
              break;
            case 200:
              SetCredentials({
                user_id: response.data.user_id,
                token: response.data.user_session_id,
                username: response.data.user_user,
                name: response.data.user_name,
                mail: response.data.user_mail
              });
              callback(response);
              break;
            default:
              break;
          }
        }, function(error) {
          console.log(error);
        });
      }

      function Logout(callback) {

        var token = '';

        if ($cookies.get('currentUser')) {
          token = $cookies.get('currentUser').token;
        }

        $http({
          method: 'POST',
          url: URLS.root + 'logout.php',
          data: { token: token },
        }).success(function(response) {
          ClearCredentials();
          callback(response);
        });
      }

      function SetCredentials(data) {
        var expiration = new Date();
        expiration.setDate(expiration.getDate() + 1);
        //expiration.setSeconds(expiration.getSeconds() + 10);

        //$http.defaults.headers.common['user-session-id'] = token;
        $cookies.putObject('currentUser', data, { 'expires': expiration });
      }

      function ClearCredentials() {
        $cookies.remove('currentUser');
        //$http.defaults.headers.common.Authorization = 'Basic';
      }

    }]);
