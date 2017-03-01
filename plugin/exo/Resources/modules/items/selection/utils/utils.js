import {tex} from './../../../utils/translate'
import $ from 'jquery'

export const utils = {}

utils.makeTextHtml = (text, elements) => {
  let idx = 0

  elements.sort((a, b) => {return a.begin - b.begin})
  //console.log(elements)

  elements.forEach(solution => {
    //console.log('current idx', idx)
    //console.log('begin', solution.begin)
    //console.log('substr', text.substr(0, solution.begin + idx))

    text = text.slice(0, solution.begin + idx)
    + getFirstSpan()
    + text.slice(solution.begin + idx, solution.end + idx)
    + '</span>'
    + getEditButtons(solution)
    + text.slice(solution.end + idx)

    idx += utils.getHtmlLength(solution);
  })

  return text
}

function getFirstSpan() {
  return '<span class="span-selection" style="background-color: gray">';
}

utils.getHtmlLength = (solution) => {
  let html = getFirstSpan() + '</span>' + getEditButtons(solution)

  return html.length
  const tmp = document.createElement('div')
  tmp.innerHTML = html

  return tmp.innerHTML.length
}

function getEditButtons(solution) {

  const id = solution.selectionId ? solution.selectionId: solution.id

  //a one liner is important otherwise space and \n will mess everything up
  return `<span class="selection-buttons"><i style="cursor: pointer" class="fa fa-pencil edit-selection-btn selection-button" data-selection-id="${id}"></i><i style="cursor: pointer"class="fa fa-trash delete-selection-btn selection-button"  data-selection-id="${id}"></i></span>`
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
