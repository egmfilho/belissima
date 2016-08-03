/**
 * Created by egmfilho on 03/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .factory('CustoProduto', ['DataSaida', function(data) {

    function CustoProduto(custoProduto) {
      this.id = custoProduto.id;
      this.produtoId = custoProduto.produtoId;
      this.usuarioId = custoProduto.usuarioId;
      this.valor = custoProduto.valor;
      this.data = custoProduto.data;
    }

    CustoProduto.converterEmEntrada = function(product_cost) {
      var custoProduto = { };

      custoProduto.id = product_cost.product_cost_id;
      custoProduto.produtoId = product_cost.product_id;
      custoProduto.usuarioId = product_cost.user_id;
      custoProduto.valor = product_cost.product_cost_value;
      custoProduto.data = product_cost.product_cost_date;

      return custoProduto;
    };

    CustoProduto.converterEmSaida = function(custoProduto) {
      var productCost = { };

      product_cost.product_cost_id = custoProduto.id;
      product_cost.product_id = custoProduto.produtoId;
      product_cost.user_id = custoProduto.usuarioId;
      product_cost.product_cost_value = custoProduto.valor;
      product_cost.product_cost_date = data.converter(custoProduto.data);

      return productCost;
    };

    return CustoProduto;

  }]);
