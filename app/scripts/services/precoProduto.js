/**
 * Created by egmfilho on 03/08/16.
 */

'use strict';

angular.module('belissimaApp')
  .factory('PrecoProduto', ['DataSaida', 'Usuario', function(data, Usuario) {

    function PrecoProduto(precoProduto) {
      this.id = precoProduto ? precoProduto.id : '';
      this.produtoId = precoProduto ? precoProduto.produtoId : '';
      this.usuarioId = precoProduto ? precoProduto.usuarioId : '';
      this.usuario = precoProduto ? precoProduto.usuario : new Usuario();
      this.valor = precoProduto ? precoProduto.valor : '';
      this.data = precoProduto ? precoProduto.data : '';
    }

    PrecoProduto.prototype = {

    };

    PrecoProduto.converterEmEntrada = function(productPrice) {
      var precoProduto = { };

      precoProduto.id = productPrice.product_price_id;
      precoProduto.produtoId = productPrice.product_id;
      precoProduto.usuarioId = productPrice.user_id;

      if (productPrice.user) {
        precoProduto.usuario = new Usuario(Usuario.converterEmEntrada(productPrice.user));
      } else {
        precoProduto.usuario = new Usuario();
      }

      precoProduto.valor = productPrice.product_price_value;
      precoProduto.data = new Date(productPrice.product_price_date);

      return precoProduto;
    };

    PrecoProduto.converterEmSaida = function(precoProduto) {
      var productPrice = { };

      productPrice.product_price_id = precoProduto.id;
      productPrice.product_id = precoProduto.produtoId;
      productPrice.user_id = precoProduto.usuarioId;
      productPrice.product_price_value = precoProduto.valor;

      return productPrice;
    };

    return PrecoProduto;

  }]);
