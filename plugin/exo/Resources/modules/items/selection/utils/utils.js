import {tex} from './../../../utils/translate'
import $ from 'jquery'

export const utils = {}

utils.makeTextHtml = (text, elements) => {
  let idx = 0

  elements.sort((a, b) => {return a.begin - b.begin})

  elements.forEach(solution => {
    text = text.slice(0, solution.begin + idx)
    + utils.getFirstSpan()
    + text.slice(solution.begin + idx, solution.end + idx)
    + '</span>'
    + getEditButtons(solution)
    + text.slice(solution.end + idx)

    idx += utils.getHtmlLength(solution) //+ 1 //+1 is wtf, maybe an error is lurking somewhere but the positions seems to be good

  })

  return text
}

utils.getFirstSpan = () => {
  return '<span class="span-selection">'
}

utils.getHtmlLength = (solution) => {
  let html = utils.getFirstSpan() + '</span>' + getEditButtons(solution)

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
