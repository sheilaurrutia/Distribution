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

  this.BoundaryQuestionService.init(this.question)

}

// Extends AbstractQuestionCtrl
BoundaryQuestionCtrl.prototype = Object.create(AbstractQuestionCtrl.prototype)

/**
 * regions drawn by user
 * @type {Array}
 */
BoundaryQuestionCtrl.prototype.regions = []


BoundaryQuestionCtrl.prototype.play = function play (region) {
  this.BoundaryQuestionService.play(region)
}

BoundaryQuestionCtrl.prototype.mark = function mark () {
  let region = this.BoundaryQuestionService.addRegion()
  this.regions.push(region)
}

BoundaryQuestionCtrl.prototype.removeRegion = function removeRegion (region) {
  let regionIndex = this.regions.indexOf(region)
  this.regions.splice(regionIndex, 1)
}



export default BoundaryQuestionCtrl
