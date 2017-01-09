import isEmpty from 'lodash/isEmpty'

import {makeActionCreator} from './../../utils/actions'
import {REQUEST_SEND} from './../../api/actions'
import {actions as quizActions} from './../actions'
import {VIEW_PLAYER} from './../enums'
import quizSelectors from './../selectors'
import {navigate} from './../router'
import {select as playerSelectors} from './selectors'
import {generatePaper} from './../papers/generator'
import {normalize, denormalizeAnswers} from './normalizer'

export const ATTEMPT_START  = 'ATTEMPT_START'
export const ATTEMPT_FINISH = 'ATTEMPT_FINISH'
export const STEP_OPEN      = 'STEP_OPEN'
export const ANSWER_UPDATE  = 'ANSWER_UPDATE'
export const ANSWERS_SUBMIT = 'ANSWERS_SUBMIT'
export const TEST_MODE_SET  = 'TEST_MODE_SET'
export const HINT_USE       = 'HINT_USE'

export const actions = {}

actions.setTestMode = makeActionCreator(TEST_MODE_SET, 'testMode')
actions.startAttempt = makeActionCreator(ATTEMPT_START, 'paper', 'answers')
actions.finishAttempt = makeActionCreator(ATTEMPT_FINISH, 'paper')
actions.openStep = makeActionCreator(STEP_OPEN, 'step')
actions.updateAnswer = makeActionCreator(ANSWER_UPDATE, 'questionId', 'answerData')
actions.submitAnswers = makeActionCreator(ANSWERS_SUBMIT, 'quizId', 'paperId', 'answers')
actions.useHint = makeActionCreator(HINT_USE, 'questionId', 'hintId')

actions.fetchAttempt = quizId => ({
  [REQUEST_SEND]: {
    route: ['exercise_attempt_start', {exerciseId: quizId}],
    request: {method: 'POST'},
    success: (data) => {
      const normalized = normalize(data)
      return actions.initPlayer(normalized.paper, normalized.answers)
    },
    failure: () => () => navigate('overview') // double fat arrow is needed because navigate is not an action creator
  }
})

actions.sendAnswers = (quizId, paperId, answers) =>({
  [REQUEST_SEND]: {
    route: ['exercise_attempt_submit', {exerciseId: quizId, id: paperId}],
    request: {
      method: 'PUT',
      body: JSON.stringify(denormalizeAnswers(answers))
    },
    success: () => actions.submitAnswers(quizId, paperId, answers)
  }
})

actions.requestHint = (quizId, paperId, hintId) => ({
  [REQUEST_SEND]: {
    route: ['exercise_attempt_hint_show', {exerciseId: quizId, paperId: paperId, hintId: hintId}],
    success: (hint) => actions.useHint(hint.id)
  }
})

actions.requestEnd = (quizId, paperId) => ({
  [REQUEST_SEND]: {
    route: ['exercise_attempt_finish', {exerciseId: quizId, id: paperId}],
    request: {
      method: 'PUT'
    },
    success: (data) => {
      const normalized = normalize(data)

      return actions.handleAttemptEnd(normalized.paper)
    }
  }
})

actions.play = (previousPaper = null, testMode = false) => {
  return (dispatch, getState) => {
    dispatch(actions.setTestMode(testMode))

    if (!playerSelectors.offline(getState())) {
      // Request a paper from the API and open the player
      return dispatch(actions.fetchAttempt(quizSelectors.quiz(getState()).id))
    } else {
      // Create a new local paper and open the player
      return dispatch(
        actions.initPlayer(generatePaper(
          quizSelectors.quiz(getState()),
          quizSelectors.steps(getState()),
          previousPaper
        ))
      )
    }
  }
}

actions.submit = (quizId, paperId, answers = {}) => {
  return (dispatch, getState) => {
    if (isEmpty(answers)) {
      const updated = {}
      for (let answer in answers) {
        if (answers.hasOwnProperty(answer) && answers[answer]._touched) {
          // Answer has been modified => send it to the server
          updated[answer] = answers[answer]
        }
      }

      if (!playerSelectors.offline(getState())) {
        return dispatch(actions.sendAnswers(quizId, paperId, updated))
      } else {
        // This seems a little hacky but if we dispatch a regular action
        // we don't have access to the promise interface provided by redux-thunk
        // and we can not link next actions using `then` callback like when the server is called.
        // Offline mode should be bundled in the api middleware to avoid this promise wrapping
        return dispatch((dispatch) => Promise.resolve(dispatch(actions.submitAnswers(quizId, paperId, updated))))
      }
    }

    // Nothing to do, we just resolve a promise to let the action chain continue
    return Promise.resolve()
  }
}

actions.navigateTo = (quizId, paperId, nextStep, pendingAnswers = {}) => {
  return (dispatch) => {
    // Submit answers for the current step
    return dispatch(actions.submit(quizId, paperId, pendingAnswers)).then(() =>
      // Open the requested step
      dispatch(actions.openStep(nextStep))
    )
  }
}

actions.finish = (quizId, paper, pendingAnswers = {}) => {
  return (dispatch, getState) =>
    // First, submit answers for the current step
    dispatch(actions.submit(quizId, paper.id, pendingAnswers)).then(() => {
      if (!playerSelectors.offline(getState())) {
        // Send finish request to API
        return dispatch(actions.requestEnd(quizId, paper.id))
      } else {
        // Finish the attempt and use quiz config to know what to do next
        return dispatch(actions.handleAttemptEnd(paper))
      }
    })
}

actions.handleAttemptEnd = (paper) => {
  return (dispatch) => {
    // Finish the current attempt
    dispatch(actions.finishAttempt(paper))

    // We will decide here if we show the correction now or not and where we redirect the user

    navigate('overview')
  }
}

actions.initPlayer = (paper, answers = {}) => {
  return (dispatch) => {
    dispatch(actions.startAttempt(paper, answers))

    const firstStep = paper.structure[0]

    dispatch(actions.openStep(firstStep))
    dispatch(quizActions.updateViewMode(VIEW_PLAYER))
  }
}

actions.showHint = (quizId, paperId, hint) => {
  return (dispatch, getState) => {
    if (playerSelectors.offline(getState())) {
      return dispatch(actions.requestHint(quizId, paperId, hint.id))
    } else {
      return dispatch(actions.useHint(hint.id))
    }
  }
}