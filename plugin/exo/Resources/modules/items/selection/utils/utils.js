import {tex} from './../../../utils/translate'
import $ from 'jquery'

export const utils = {}

utils.makeTextHtml = (text, elements) => {
  let idx = 0
  console.log('make')

  elements.sort((a, b) => {return a.begin - b.begin})

  elements.forEach(solution => {
    text = text.slice(0, solution.begin + idx)
    + getFirstSpan()
    + text.slice(solution.begin + idx, solution.end + idx)
    + '</span>'
    + getEditButtons(solution)
    + text.slice(solution.end + idx)

    idx += utils.getHtmlLength(solution) + 1 //+1 is wtf, maybe an error is lurking somewhere but the positions seems to be good

  })

  return text
}

function getFirstSpan() {
  return '<span class="span-selection">';
}

utils.getHtmlLength = (solution) => {
  let html = getFirstSpan() + '</span>' + getEditButtons(solution)

  return html.length
}

function getEditButtons(solution) {

  const id = solution.selectionId ? solution.selectionId: solution.id

  //a one liner is important otherwise space and \n will mess everything up
  //return `<span class="selection-buttons"><i style="cursor: pointer" class="fa fa-pencil edit-selection-btn selection-button" data-selection-id="${id}"></i><i style="cursor: pointer"class="fa fa-trash delete-selection-btn selection-button"  data-selection-id="${id}"></i></span>`

  return `<span class="selection-buttons"><em class="fa fa-pencil edit-selection-btn selection-button" data-selection-id="${id}">&nbsp;</em><em class="fa fa-trash delete-selection-btn selection-button"  data-selection-id="${id}">&nbsp;</em></span>`

}

utils.getTextFromDecorated = (_text) => {
  const tmp = document.createElement('div')
  tmp.innerHTML = _text

  $(tmp).find('.selection-buttons').replaceWith('');
  $(tmp).find('.span-selection').each(function () {
    $(this).replaceWith($(this).text())
  })

  return tmp.innerHTML
}
