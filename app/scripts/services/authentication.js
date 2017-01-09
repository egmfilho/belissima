/**
 * Created by egmfilho on 07/07/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('AuthenticationService', [
    '$http',
    '$cookies',
    'Usuario',
    'URLS',
    function($http, $cookies, Usuario, URLS) {

      var service = {};

      service.login = Login;
      service.logout = Logout;
      //service.setCredentials = SetCredentials;
      //service.clearCredentials = ClearCredentials;

      function Login(username, password, callback) {

        var fake = JSON.parse('{"status":{"code":200,"message":"Ok."},"data":{"user_id":"1003","user_profile_id":"1001","user_session_id":null,"user_active":"Y","user_user":"eduardo","user_name":"Eduardo Miranda","user_mail":"eduardo@futuraagencia.com.br","user_login":"2016-12-23 17:33:51","user_update":"2016-12-23 17:34:19","user_date":"2016-09-22 12:09:34","person_id":"1005","user_current_session_id":"jio2ckofrlqnj7f8lo3l4tr3a5","user_profile":{"user_profile_id":"1001","user_profile_name":"Administrador","user_profile_update":null,"user_profile_date":"2016-06-20 11:46:20"}},"info":null}');
        SetCredentials(new Usuario(Usuario.converterEmEntrada(fake.data)));
        callback(fake);
        return;

        $http({
          method: 'POST',
          url: URLS.root + 'login.php',
          data: { user: username, pass: password },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(res) {
          if (res.status.code == 200) {
            console.log(res.data);
            SetCredentials(new Usuario(Usuario.converterEmEntrada(res.data)));
          }
          callback(res);
        }).error(function(res) {
          callback(res);
        });

      }

      function Logout(callback) {
        $http({
          method: 'POST',
          url: URLS.root + 'logout.php',
        }).success(function(response) {
          ClearCredentials();
          callback(response);
        });
      }

      function SetCredentials(data) {
        //var expiration = new Date();
        //expiration.setDate(expiration.getDate() + 1);
        //expiration.setSeconds(expiration.getSeconds() + 10);
        //$cookies.putObject('currentUser', data, { 'expires': expiration });

        console.log(data);
        $cookies.put('currentUser', window.btoa(JSON.stringify(data)), { });
      }

      function ClearCredentials() {
        $cookies.remove('currentUser');
      }

      return service;

    }]);
