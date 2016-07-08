/**
 * Created by egmfilho on 08/07/16.
 */

'use strict';

angular.module('belissimaApp')
  .factory('SessionInjector', ['$q', '$location', '$cookieStore', function($q, $location, $cookieStore) {

    return {

      'request': function(req) {

        //if ($cookieStore.get('globals').currentUser) {
        //  req.headers['x-session-token'] = '';
        //}

        return req;

      },

      'response': function(response) {

        return response;
      },

      'responseError': function(rejection) {

        if (rejection.status == 401) {
          if ($cookieStore.get('currentUser')) {
            $cookieStore.remove('currentUser');
          }

          $location.path('/login');
        }

        return $q.reject(rejection);

      }

    };

  }]);
