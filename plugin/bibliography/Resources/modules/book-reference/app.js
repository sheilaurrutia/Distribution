import angular from 'angular/index'
import 'angular-bootstrap'
import 'angular-resource'
import '#/main/core/fos-js-router/module'
import bibliographyController from './bibliography.controller.js'



angular
  .module('BibliographyModule', [
    'ui.fos-js-router',
    'ui.bootstrap',
    'ngResource'
  ])
  .controller('bibliographyController', bibliographyController)

angular.element(document).ready(function() {
  angular.bootstrap(angular.element(document).find('div#icap-bibliography-modal')[0], ['BibliographyModule'], {
    strictDi: true
  })
})