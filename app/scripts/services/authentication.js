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

        // var fake = JSON.parse('{"data":{"status":{"code":200,"message":"Ok."},"data":{"user_id":"1003","user_profile_id":"1001","user_session_id":null,"user_active":"Y","user_user":"eduardo","user_name":"Eduardo Miranda","user_mail":null,"user_login":"2017-01-25T18:36:38","user_update":"2017-01-05T19:07:45","user_date":"2016-09-22T12:09:34","person_id":"1005","user_current_session_id":"7pfcpgk6tr9v7jcmdjhpii7jt5","user_profile":{"user_profile_id":"1001","user_profile_name":"Administrador","user_profile_update":"2017-01-26T14:15:57","user_profile_date":"2016-06-20T11:46:20","user_profile_access":{"pdv":{"name":"PDV","access":{"name":"Acesso","value":"Y","data_type":"bool"}},"ticket":{"name":"Ticket","access":{"name":"Acesso","value":"Y","data_type":"bool"},"viewitem":{"name":"Visualizar Itens","value":"Y","data_type":"bool"},"deleteitem":{"name":"Excluir Itens","value":"Y","data_type":"bool"}},"product":{"name":"Produtos","access":{"name":"Acesso","value":"Y","data_type":"bool"}},"movimentation":{"name":"Movimenta\u00e7\u00e3o","access":{"name":"Acesso","value":"Y","data_type":"bool"}},"person":{"name":"Pessoas","access":{"name":"Acesso","value":"Y","data_type":"bool"}},"crm":{"name":"CRM","access":{"name":"Acesso","value":"Y","data_type":"bool"}},"report":{"name":"Relat\u00f3rios","access":{"name":"Acesso","value":"Y","data_type":"bool"}},"agenda":{"name":"Agenda","access":{"name":"Acesso","value":"Y","data_type":"bool"}},"config":{"name":"Configura\u00e7\u00f5es","access":{"name":"Acesso","value":"Y","data_type":"bool"}}}}},"info":null}, "status":200}');
        // SetCredentials(new Usuario(Usuario.converterEmEntrada(fake.data.data)));
        // callback(fake);
        // return;

        $http({
          method: 'POST',
          url: URLS.root + 'login.php',
          data: { user: username, pass: password },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(res) {
          if (res.status == 200) {
            console.log(res.data);
            SetCredentials(new Usuario(Usuario.converterEmEntrada(res.data.data)));
          }
          callback(res);
        }, function(res) {
          callback(res);
        });

      }

      function Logout(callback) {
        $http({
          method: 'POST',
          url: URLS.root + 'logout.php',
        }).then(function(response) {
          ClearCredentials();
          callback(response);
        }, function (error) {
          console.log(error);
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
