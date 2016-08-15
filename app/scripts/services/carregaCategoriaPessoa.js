/**
 * Created by egmfilho on 15/08/16.
 */

'use strict';

angular.module('belissimaApp.services')
  .factory('CarregaCategoriaPessoa', ['$rootScope', 'ProviderCategoriaPessoa', function($rootScope, provider) {

    return {
      carregar: function() {
        if (!$rootScope.categoriaPessoa) {
          providerCategoria.obterCategorias().then(function(success) {
            $rootScope.categoriaPessoa = { };
            angular.forEach(success.data.data, function(item, index) {
              $rootScope.categoriaPessoa[item.person_category_name_formatted.toString().toLowerCase()] = item.person_category_id;
            });
          }, function(error) {
            console.log(error);
          });
        }
      }
    }

  }]);
