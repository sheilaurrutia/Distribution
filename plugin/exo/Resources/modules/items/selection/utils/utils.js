import {tex} from './../../../utils/translate'
import $ from 'jquery'
import cloneDeep from 'lodash/cloneDeep'

export const utils = {}

utils.makeTextHtml = (text, elements, mode) => {
  elements = cloneDeep(elements)
  let idx = 0
  elements.sort((a, b) => {return a.begin - b.begin})

  elements.forEach(solution => {
    let end = text.slice(solution.end + idx)
     text = text.slice(0, solution.begin + idx)
     + utils.getFirstSpan(solution, mode)
     + text.slice(solution.begin + idx, solution.end + idx)
     + '</span>'
     if (mode === 'editor') text += getEditButtons(solution)
     text += end

     idx += utils.getHtmlLength(solution, mode) //+ 1 //+1 is wtf, maybe an error is lurking somewhere but the positions seems to be good

   })

  return text
}

utils.getFirstSpan = (item, mode) => {
  const id = item.selectionId ? item.selectionId: item.id

  return `<span data-selection-id="${id}" id="selection-${id}" class="span-selection">`
}

utils.getHtmlLength = (solution, mode) => {
  let html = utils.getFirstSpan(solution) + '</span>'
  if (mode === 'editor') html += getEditButtons(solution)

  return html.length
}

function getEditButtons(solution) {

  const id = solution.selectionId ? solution.selectionId: solution.id
  //A one liner is important otherwise space and \n will mess everything up for some reason I don't know
  //Also DO NOT INCLUDE 'style' for tinymce because it'll mess everything aswell for it. He doesn't like that at all.
  //Positions can't be computed that way because he recursively adds it everywhere like a retard
  //DO NOT ADD EXTRA SPACES HERE EITHER. Or it'll brake tinymce again. This is a scared line and must not be changed !
  return `<span class="selection-buttons"><em class="fa fa-pencil edit-selection-btn selection-button" data-selection-id="${id}">&nbsp;</em><em class="fa fa-trash delete-selection-btn selection-button" data-selection-id="${id}">&nbsp;</em></span>`
}

//This function allows us to remove our decorations class to get to proper text.
utils.getTextFromDecorated = (_text) => {
  const tmp = document.createElement('div')
  tmp.innerHTML = _text

  //we replace with '' because remove() leaves us with blank space (juste so you know)
  $(tmp).find('.selection-buttons').replaceWith('')
  $(tmp).find('.span-selection').each(function () {
    $(this).replaceWith($(this).text())
  })

  return tmp.innerHTML
}

utils.getRealOffsetFromBegin = (toSort, begin, mode) => {
  let idx = -1

  toSort = toSort.filter(element => {
    idx++
    return utils.getHtmlLength(element, mode) * idx + element.begin + utils.getFirstSpan(element, mode).length < begin
  }).sort((a, b) => a.begin - b.begin)

  return toSort.reduce((acc, val) => { return acc + utils.getHtmlLength(val, mode)}, 0)
}

utils.cleanItem = (item) => {
  //here we remove the unused selections
  const _text = item._text
  const elements = item.mode === 'find' ? item.solutions: item.selections
  const tmp = document.createElement('div')
  const ids = []
  let toRemove = []
  tmp.innerHTML = _text

  //REMOVE THE SELECTIONS HERE
  //what are the selection in the text ?
  $(tmp).find('.selection-button').each(function () {
    ids.push($(this).attr('data-selection-id'))
  })

  //if we're missing selections in the items, then we'll have to remove them
  if (elements) {
    elements.forEach(element => {
      let elId = element.id || element.selectionId
      let idx = ids.findIndex(id => id === elId)
      if (idx < 0) toRemove.push(elId)
    })
  }

  toRemove = toRemove.filter((item, pos) => toRemove.indexOf(item) === pos)

  const solutions = cloneDeep(item.solutions)
  const selections = cloneDeep(item.selections)

  //and now we finally remove them !!!
  toRemove.forEach(selectionId => {
    if (selections) {
      const selIdx = selections.findIndex(selection => selection.id === selectionId)
      selections.splice(selIdx, 1)
    }

    if (solutions) {
      const solIdx = solutions.findIndex(solution => solution.selectionId === selectionId)
      solutions.splice(solIdx, 1)
    }
  })

  //also we just check the text is correct
  let text = utils.getTextFromDecorated(item._text)

  //that'all for now folks !
  return Object.assign({}, item, {selections, solutions, text})
}
