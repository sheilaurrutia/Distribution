import angular from 'angular/index'
import {} from 'angular-bootstrap'
import mainTemplate from './parameters_partial.html'
import service from './notification.service.js'
import controller from './notificationCtrl.js'

angular
	.module('NotificationModule', [
		'ui.bootstrap'
	])
	.service('notificationService',[
		'$http',
		service
	])
	.controller('notificationCtrl',[
		'notificationService',
		controller
	])
	.directive('notification',()=>({
		controllerAs: 'notif',
		bindToController: true,
		controller: 'notificationCtrl',
		template: mainTemplate
	}))
	.filter('trans', () => (string, domain = 'platform') =>
    	Translator.trans(string, domain)
  	)