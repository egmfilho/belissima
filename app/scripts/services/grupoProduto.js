/**
 * Created by egmfilho on 19/07/16.
 */
'use strict';

angular.module('belissimaApp')
  .factory('GrupoProduto', ['DataSaida', function(data) {

    function GrupoProduto(grupoProduto) {
      this.id = grupoProduto ? grupoProduto.id : '';
      this.parentId = grupoProduto ? grupoProduto.parentId : '';
      this.codigo = grupoProduto ? grupoProduto.codigo : '';
      this.classificacao = grupoProduto ? grupoProduto.classificacao : '';
      this.nome = grupoProduto ? grupoProduto.nome : '';
      this.tipo = grupoProduto ? grupoProduto.tipo : '';
      this.data = grupoProduto ? grupoProduto.data : '';
      this.subgrupo = grupoProduto ? grupoProduto.subgrupo : [ ];
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

      if (productGroup.product_group_subgroup) {
        grupoProduto.subgrupo = [ ];
        angular.forEach(productGroup.product_group_subgroup, function(item, index) {
          grupoProduto.subgrupo.push(new GrupoProduto(GrupoProduto.converterEmEntrada(item)));
        });
      } else {
        grupoProduto.subgrupo = [ ];
      }

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
