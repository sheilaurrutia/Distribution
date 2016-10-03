import AbstractQuestionCtrl from './AbstractQuestionCtrl'

/**
 * Choice Question Controller
 * @param {FeedbackService}       FeedbackService
 * @param {BoundaryQuestionService} BoundaryQuestionService
 * @constructor
 */
function BoundaryQuestionCtrl(FeedbackService, BoundaryQuestionService) {
  AbstractQuestionCtrl.apply(this, arguments)
  this.BoundaryQuestionService = BoundaryQuestionService
  this.FeedbackService = FeedbackService

}

// Extends AbstractQuestionCtrl
BoundaryQuestionCtrl.prototype = Object.create(AbstractQuestionCtrl.prototype)

/**
 * Stores Choices to be able to toggle there state
 * @type {Array}
 */
BoundaryQuestionCtrl.prototype.regions = []


export default BoundaryQuestionCtrl
