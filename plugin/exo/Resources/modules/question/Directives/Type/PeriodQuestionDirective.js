import angular from 'angular/index'
import AbstractQuestionDirective from './AbstractQuestionDirective'
import period from './../../Partials/Type/period.html'

/**
 * Choice Question Directive
 * Manages Question of types Choice
 *
 * @returns {object}
 * @constructor
 */
function PeriodQuestionDirective() {
  return angular.merge({}, AbstractQuestionDirective.apply(this, arguments), {
    controller: 'PeriodQuestionCtrl',
    controllerAs: 'periodQuestionCtrl',
    template: period
  })
}

// Set up dependency injection (get DI from parent too)
PeriodQuestionDirective.$inject = AbstractQuestionDirective.$inject

export default PeriodQuestionDirective
