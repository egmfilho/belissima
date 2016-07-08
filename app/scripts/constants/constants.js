/**
 * Created by egmfilho on 07/07/16.
 */

'use strict';

angular.module('belissimaApp')
  .constant('LOGIN_STATUS', {
    sucesso: 200,
    nao_autorizado: 401,
    usuario_nao_encontrado: 404,
    senha_incorreta: 0
  })
  .constant('URLS', {
    root: 'http://enterprise/belissima/public/',
    login: 'http://enterprise/belissima/public/login.php',
    logout: 'http://enterprise/belissima/public/logout.php',
    home: 'http://enterprise/belissima/public/home.php'
  });
