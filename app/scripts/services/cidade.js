/**
 * Created by egmfilho on 03/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .factory('Cidade', ['DataSaida', function(data) {

    function Cidade(cidade) {
      this.id = cidade ? cidade.id : '';
      this.codigo = cidade ? cidade.codigo : '';
      this.nome = cidade ? cidade.nome : '';
      this.uf = cidade ? cidade.uf : '';
      this.ibge = cidade ? cidade.ibge : '';
      this.data = cidade ? cidade.data : '';
    }

    Cidade.converterEmEntrada = function(city) {
      var cidade = { };

      cidade.id = city.city_id;
      cidade.codigo = city.city_code;
      cidade.nome = city.city_name;
      cidade.uf = city.city_uf;
      cidade.ibge = city.city_ibge;
      cidade.data = new Date(city.city_date);

      return cidade;
    };

    Cidade.converterEmSaida = function(cidade) {
      var city = { };

      city.city_id = cidade.id;
      city.city_code = cidade.codigo;
      city.city_name = cidade.nome;
      city.city_uf = cidade.uf;
      city.city_ibge = cidade.ibge;
      city.city_date = data.converter(cidade.data);

      return city;
    };

    return Cidade;

  }]);
