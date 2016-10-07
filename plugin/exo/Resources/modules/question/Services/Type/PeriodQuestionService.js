import AbstractQuestionService from './AbstractQuestionService'


/**
 * Period Question Service
 * @param {FeedbackService} FeedbackService
 * @constructor
 */
function PeriodQuestionService($log, $timeout, FeedbackService) {
  AbstractQuestionService.call(this, $log, FeedbackService)
  this.$timeout = $timeout
}

// Extends AbstractQuestionCtrl
PeriodQuestionService.prototype = Object.create(AbstractQuestionService.prototype)

PeriodQuestionService.prototype.wavesurferOptions = {
  container: '#waveform',
  waveColor: '#172B32',
  progressColor: '#bbb',
  height: 256,
  interact: true,
  scrollParent: false,
  normalize: true,
  minimap: true
}

PeriodQuestionService.prototype.wavesurferRegionOptions = {
  color: 'rgba(92,92,92,0.5)',
  drag: true,
  resize: true
}

PeriodQuestionService.prototype.wavesurferMinimapOptions =  {
  height: 30,
  waveColor: '#ddd',
  progressColor: '#999',
  cursorColor: '#999'
}

/**
 * Init answer array
 */
PeriodQuestionService.prototype.initAnswer = function initAnswer() {
  return []
}

/**
 * Get the correct answer(s) ids from the solutions of a Question
 * @returns {Array}
 */
PeriodQuestionService.prototype.getCorrectAnswer = function getCorrectAnswer(question) {
  let awaitedAnswers = []
  if (question.solutions) {
    for (let solution of question.solutions) {
      awaitedAnswers.push(solution.region.id)
    }
  }
  return awaitedAnswers
}

/**
 * Compute total score available for the question
 */
PeriodQuestionService.prototype.getTotalScore = function getTotalScore(question) {
  let total = 0
  if(question.solutions){
    for (let solution of question.solutions) {
      total += solution.region.valid ? solution.score : 0
    }
  }
  return total
}

/**
 * Compute score for the answer(s) given
 */
PeriodQuestionService.prototype.getAnswerScore = function getAnswerScore(question, answers) {
  let score = 0

  if (question.solutions && question.solutions.length !== 0 && answers && 0 !== answers.length) {
    const found = this.getFoundSolutions(question.solutions, answers)
    if (0 !== found.length) {
      for (let item of found) {
        score += item.score
      }
    }
  }

  if (0 > score) {
    score = 0
  }

  return score
}

PeriodQuestionService.prototype.getFoundSolutions = function (solutions, answers) {
  let found = []
  for(let solution of solutions){
    if (answers.find(el => el.region.id) !== undefined){
      found.push(solution)
    }
  }
  return found
}

/**
 * Check if all, all but one, or not all answers are found
 * @TODO some solutions are invalid... they have a negative score... or not.... but theyre region property has an valid porperty... use that
 */
PeriodQuestionService.prototype.answersAllFound = function answersAllFound(question, answer) {
  var feedbackState = -1

  if (question.solutions) {
    var numAnswersFound = 0
    var numSolutions = 0
    var uniqueSolutionFound = false

    if (answer) {
      for (var i=0; i<question.solutions.length; i++) {
        if (question.solutions[i].score > 0) {
          numSolutions++
        }
        for (var j=0; j<answer.length; j++) {
          if (question.solutions[i].id === answer[j] && question.solutions[i].score > 0) {
            numAnswersFound++
          }
        }
      }
    }

    if (numAnswersFound === numSolutions || uniqueSolutionFound) {
            // all answers have been found
      feedbackState = this.FeedbackService.SOLUTION_FOUND
    } else if (numAnswersFound === numSolutions -1 && question.multiple) {
            // one answer remains to be found
      feedbackState = this.FeedbackService.ONE_ANSWER_MISSING
    } else {
            // more answers remain to be found
      feedbackState = this.FeedbackService.MULTIPLE_ANSWERS_MISSING
    }
  }

  return feedbackState
}

PeriodQuestionService.prototype.getLeftPostionFromTime = function getLeftPostionFromTime(time, wavesurfer) {
  const duration = wavesurfer.getDuration()
  const canvas = wavesurfer.container.children[0].children[0]
  const cWidth = canvas.clientWidth
  return time * cWidth / duration
}

PeriodQuestionService.prototype.getTimeFromPosition = function getTimeFromPosition(position, wavesurfer) {
  const duration = wavesurfer.getDuration()
  const canvas = wavesurfer.container.children[0].children[0]
  const cWidth = canvas.clientWidth
  return position * duration / cWidth
}

PeriodQuestionService.prototype.createRegion = function createRegion(start, end, wavesurfer){
  let startTime
  let endTime
  if(null !== start && null !== end){
    startTime = start
    endTime = end
  } else {
    const currentTime = wavesurfer.getCurrentTime()
    const duration = wavesurfer.getDuration()
    startTime = currentTime > 1 ? currentTime - 1 : 0
    endTime = currentTime < (duration - 1) ? currentTime + 1 : duration
  }

  const startMarker = {
    time: startTime,
    before: 0,
    after: 0
  }

  const endMarker = {
    time: endTime,
    before: 0,
    after: 0
  }

  return {
    uuid: '1',
    valid: true,
    start:startMarker,
    end:endMarker
  }
}

export default PeriodQuestionService
