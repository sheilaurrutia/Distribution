import {Selection as component} from './editor.jsx'

export const actions = {

}

export default {
  component,
  reduce,
  validate,
  decorate
}

function decorate(item) {
  return item
}

function reduce(item = {}/*, action*/) {
  return item
}


function validate(/*item*/) {
  return []
}
