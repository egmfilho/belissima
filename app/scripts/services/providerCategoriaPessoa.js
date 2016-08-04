/**
 * Created by egmfilho on 04/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .provider('ProviderCategoriaPessoa', ['URLS', function(urls) {

    var url = urls.root + 'person_category.php?action=getList';

    this.$get = ['$http', function($http) {

      return {
        obterCategorias: function() {
          return $http.post(url, { }, { });
        }
      }

    }];

  }]);
