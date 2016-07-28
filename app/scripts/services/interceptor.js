/**
 * Created by egmfilho on 08/07/16.
 */

'use strict';

angular.module('belissimaApp')
  .factory('SessionInjector', [
    '$q',
    '$location',
    '$cookies',
    'HTTP_STATUS',
    function($q, $location, $cookies, http_status) {

      return {

        'request': function(req) {

          if ($cookies.get('currentUser')) {
            req.headers['x-session-token'] = $cookies.getObject('currentUser').token;
          }

          req.headers['Content-Type'] = 'application/x-www-form-urlencoded';

          return req;

        },

        'responseError': function(rejection) {

          if (rejection.status == http_status.nao_autorizado) {
            if ($cookies.getObject('currentUser')) {
              $cookies.remove('currentUser');
            }

            $location.path('/login');
          } else if (rejection.status == http_status.falha_na_expectativa){

          }

          return $q.reject(rejection);

        }

      };

  }]);
