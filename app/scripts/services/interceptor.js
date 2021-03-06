/**
 * Created by egmfilho on 08/07/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('SessionInjector', [
    '$q',
    '$location',
    '$cookies',
    '$httpParamSerializerJQLike',
    'HTTP_STATUS',
    'URLS',
    function($q, $location, $cookies, $httpParamSerializerJQLike, http_status, urls) {

      return {

        'request': function(req) {

          if (req.url.indexOf(urls.root) != -1) {
            req.headers['x-session-token'] = 'lucilei';
          }

          req.headers['Content-Type'] = 'application/x-www-form-urlencoded';

          req.data = $httpParamSerializerJQLike(req.data);

          return req;

        },

        'response': function(res) {

          return res;
        },

        'responseError': function(rejection) {

          if (rejection.status == http_status.nao_autorizado) {
            if ($cookies.get('currentUser')) {
              $cookies.remove('currentUser');
            }

            $location.path('/login');
          } else if (rejection.status == http_status.falha_na_expectativa){

          }

          return $q.reject(rejection);

        }

      };

  }]);
