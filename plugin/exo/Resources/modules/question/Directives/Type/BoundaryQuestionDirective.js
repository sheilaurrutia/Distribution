import angular from 'angular/index'
import AbstractQuestionDirective from './AbstractQuestionDirective'
import boundary from './../../Partials/Type/boundary.html'

/**
 * Choice Question Directive
 * Manages Question of types Choice
 *
 * @returns {object}
 * @constructor
 */
function BoundaryQuestionDirective() {
  return angular.merge({}, AbstractQuestionDirective.apply(this, arguments), {
    controller: 'BoundaryQuestionCtrl',
    controllerAs: 'boundaryQuestionCtrl',
    template: boundary
  })
}

// Set up dependency injection (get DI from parent too)
BoundaryQuestionDirective.$inject = AbstractQuestionDirective.$inject

export default BoundaryQuestionDirective
