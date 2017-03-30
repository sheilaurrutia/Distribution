import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {DragDropContext} from 'react-dnd'
import {Quiz as QuizComponent} from './components/quiz.jsx'
import {normalize} from './normalizer'
import {decorate} from './decorators'
import {createStore} from './store'
import {makeRouter} from './router'
import {makeSaveGuard} from './editor/save-guard'
import {registerDefaultItemTypes, getDecorators} from './../items/item-types'
import {registerDefaultContentItemTypes} from './../contents/content-types'
import {registerModalType} from './../modal'
import {MODAL_ADD_ITEM, AddItemModal} from './editor/components/add-item-modal.jsx'
import {MODAL_IMPORT_ITEMS, ImportItemsModal} from './editor/components/import-items-modal.jsx'
import {MODAL_ADD_CONTENT, AddContentModal} from './editor/components/add-content-modal.jsx'
import {MODAL_CONTENT, ContentModal} from './../contents/components/content-modal.jsx'
import {default as HTML5Backend} from '#/main/core/html5-touch-backend'

export class Quiz {
  constructor(rawQuizData, noServer = false) {
    registerDefaultItemTypes()
    registerDefaultContentItemTypes()
    registerModalType(MODAL_ADD_ITEM, AddItemModal)
    registerModalType(MODAL_IMPORT_ITEMS, ImportItemsModal)
    registerModalType(MODAL_ADD_CONTENT, AddContentModal)
    registerModalType(MODAL_CONTENT, ContentModal)
    const quizData = decorate(normalize(rawQuizData), getDecorators(), rawQuizData.meta.editable)
    this.store = createStore(Object.assign({noServer: noServer}, quizData))
    this.dndQuiz = DragDropContext(HTML5Backend)(QuizComponent)
    makeRouter(this.store.dispatch.bind(this.store))
    makeSaveGuard(this.store.getState.bind(this.store))
  }

  render(element) {
    ReactDOM.render(
      React.createElement(
        Provider,
        {store: this.store},
        React.createElement(this.dndQuiz)
      ),
      element
    )
  }
}
