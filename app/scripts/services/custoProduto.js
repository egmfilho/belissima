/**
 * Created by egmfilho on 03/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .factory('CustoProduto', ['DataSaida', function(data) {

    function CustoProduto(custoProduto) {
      this.id = custoProduto ? custoProduto.id : '';
      this.produtoId = custoProduto ? custoProduto.produtoId : '';
      this.usuarioId = custoProduto ? custoProduto.usuarioId : '';
      this.valor = custoProduto ? custoProduto.valor : '';
      this.data = custoProduto ? custoProduto.data : '';
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

      productCost.product_cost_id = custoProduto.id;
      productCost.product_id = custoProduto.produtoId;
      productCost.user_id = custoProduto.usuarioId;
      productCost.product_cost_value = custoProduto.valor;
      productCost.product_cost_date = data.converter(custoProduto.data);

      return productCost;
    };

    return CustoProduto;

  }]);