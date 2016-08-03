/**
 * Created by egmfilho on 19/07/16.
 */
'use strict';

angular.module('belissimaApp')
  .factory('GrupoProduto', ['DataSaida', function(data) {

    function GrupoProduto(grupoProduto) {
      this.id = grupoProduto.id;
      this.parentId = grupoProduto.parentId;
      this.codigo = grupoProduto.codigo;
      this.classificacao = grupoProduto.classificacao;
      this.nome = grupoProduto.nome;
      this.tipo = grupoProduto.tipo;
      this.data = grupoProduto.data;
    }

    GrupoProduto.prototype = {

    };

    GrupoProduto.converterEmEntrada = function(productGroup) {
      var grupoProduto = { };

      grupoProduto.id = productGroup.product_group_id;
      grupoProduto.parentId = productGroup.product_group_parent_id;
      grupoProduto.codigo = productGroup.product_group_code;
      grupoProduto.classificacao = productGroup.product_group_classification;
      grupoProduto.nome = productGroup.product_group_name;
      grupoProduto.tipo = productGroup.product_group_type;
      grupoProduto.data = productGroup.product_group_date;

      return grupoProduto;
    };

    GrupoProduto.converterEmSaida = function(grupoProduto) {
      var productGroup = { };

      productGroup.product_group_id = grupoProduto.id;
      productGroup.product_group_parent_id = grupoProduto.parentId;
      productGroup.product_group_code = grupoProduto.codigo;
      productGroup.product_group_classification = grupoProduto.classificacao;
      productGroup.product_group_name = grupoProduto.nome;
      productGroup.product_group_type = grupoProduto.tipo;
      productGroup.product_group_date = data.converter(grupoProduto.data);

      return productGroup;
    };

    return GrupoProduto;

  }]);
