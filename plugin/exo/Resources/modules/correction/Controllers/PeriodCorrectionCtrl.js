import AbstractCorrectionCtrl from './AbstractCorrectionCtrl'

/**
 * Correction for Choice question
 * @param {QuestionService}       QuestionService
 * @param {PeriodQuestionService} ChoiceQuestionService
 * @constructor
 */
function PeriodCorrectionCtrl(QuestionService, PeriodQuestionService) {
  AbstractCorrectionCtrl.apply(this, arguments)

  this.PeriodQuestionService = PeriodQuestionService
}

// Extends AbstractQuestionCtrl
PeriodCorrectionCtrl.prototype = Object.create(AbstractCorrectionCtrl.prototype)

/**
 * Check if a choice has been selected by User
 * @param   {Object} choice
 * @returns {Boolean}
 */
/*ChoiceCorrectionCtrl.prototype.isChoiceSelected = function isChoiceSelected(choice) {
  return this.ChoiceQuestionService.isChoiceSelected(this.answer, choice)
}

ChoiceCorrectionCtrl.prototype.getChoiceSolution = function getChoiceSolution(choice) {
  return this.ChoiceQuestionService.getChoiceSolution(this.question, choice)
}

ChoiceCorrectionCtrl.prototype.getChoiceStats = function getChoiceStats(choice) {
  return this.ChoiceQuestionService.getChoiceStats(this.question, choice)
}*/

export default PeriodCorrectionCtrl
