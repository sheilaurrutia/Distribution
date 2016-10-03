import AbstractQuestionService from './AbstractQuestionService'

/**
 * Choice Question Service
 * @param {FeedbackService} FeedbackService
 * @constructor
 */
function BoundaryQuestionService($log, FeedbackService) {
  AbstractQuestionService.call(this, $log, FeedbackService)
}

// Extends AbstractQuestionCtrl
BoundaryQuestionService.prototype = Object.create(AbstractQuestionService.prototype)



export default BoundaryQuestionService
