import angular from 'angular/index'
import {} from 'angular-bootstrap'
import mainTemplate from './parameters_partial.html'
import service from './notification.service.js'
import controller from './notificationCtrl.js'
import '#/main/core/fos-js-router/module'
import '#/main/core/form/module'
import Interceptors from '#/main/core/interceptorsDefault'

angular
  .module('NotificationModule', [
    'ui.bootstrap',
    'ui.bootstrap.modal',
    'ui.fos-js-router',
    'FormBuilder'
  ])
  .service('notificationService', [
    '$http',
    'FormBuilderService',
    service
  ])
  .factory('notificationModal', [
    '$uibModal',
    $modal => ({
      open: template => $modal.open({ template })
    })
  ])
  .controller('notificationCtrl',[
    'notificationService',
    'notificationModal',
    controller
  ])
  .directive('notification',()=>({
    controllerAs: 'notif',
    bindToController: true,
    controller: 'notificationCtrl',
    template: mainTemplate
  }))
  .filter('trans', () => (string, domain = 'platform') =>
    window.Translator.trans(string, domain)
  )
  .config(Interceptors)
