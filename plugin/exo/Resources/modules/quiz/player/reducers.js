import {update} from './../../utils/utils'
import {makeReducer} from './../../utils/reducers'
import {decorateAnswer} from './decorators'
import moment from 'moment'

import {
  TEST_MODE_SET,
  ATTEMPT_START,
  ATTEMPT_FINISH,
  STEP_OPEN,
  ANSWER_UPDATE,
  ANSWERS_SUBMIT,
  HINT_USE
} from './actions'

function setTestMode(state, action) {
  return action.testMode
}

function initPaper(state, action) {
  return action.paper
}

function finishPaper(state, action) {
  return update(state, {
    ['finished']: {$set: true},
    ['endDate']: {
      $set: (action.paper.endDate ? action.paper.endDate : moment().format('YYYY-MM-DD\Thh:mm:ss'))
    }
  })
}

function initAnswers(state, action) {
  return action.answers
}

function updateAnswer(state, action) {
  return update(state, {[action.questionId]: {$merge: { data: action.answerData, _touched: true }}})
}

function submitAnswers(state, action) {
  const updatedAnswers = {}
  for (let questionId in action.answers) {
    if (action.answers.hasOwnProperty(questionId)) {
      let answer = action.answers[questionId]

      updatedAnswers[questionId] = update(answer, {
        ['_touched']: {$set: false},
        ['tries']: {$set: answer.tries + 1}
      })
    }
  }

  return update(state, {$merge: updatedAnswers})
}

function initCurrentStepAnswers(state, action) {
  const newAnswers = action.step.items.reduce((acc, itemId) => {
    if (!state[itemId]) {
      acc[itemId] = decorateAnswer({ questionId: itemId, _touched: true })
    }
    
    return acc
  }, {})

  return update(state, {$merge: newAnswers})
}

function setCurrentStep(state, action) {
  return action.step.id
}

function useHint(state, action) {
  let answer
  if (!state[action.questionId]) {
    answer = decorateAnswer({
      usedHints: [action.hintId]
    })
  } else {
    answer = update(state[action.questionId], {
      ['usedHints']: {$push: [action.hintId]}
    })
  }

  return update(state, {
    [action.questionId]: {$set: answer}
  })
}

export const reducers = {
  testMode: makeReducer(false, {
    [TEST_MODE_SET]: setTestMode
  }),
  currentStep: makeReducer(null, {
    [STEP_OPEN]: setCurrentStep
  }),
  paper: makeReducer({}, {
    [ATTEMPT_START]: initPaper,
    [ATTEMPT_FINISH]: finishPaper
  }),
  answers: makeReducer({}, {
    [ATTEMPT_START]: initAnswers,
    [STEP_OPEN]: initCurrentStepAnswers,
    [ANSWER_UPDATE]: updateAnswer,
    [ANSWERS_SUBMIT]: submitAnswers,
    [HINT_USE]: useHint
  })
}