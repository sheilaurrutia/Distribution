import {tex} from './../../../utils/translate'

export const utils = {}

utils.makeTextHtml = (text, elements) => {
  let idx = 0

  elements.sort((a, b) => {return a.begin - b.begin})

  elements.forEach(solution => {
    //txt1.slice(0, 3) + "bar" + txt1.slice(3);
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
  return '<span class="well">';
}

utils.getHtmlLength = (solution) => {
  return getFirstSpan().length + getEditButtons(solution).length + '</span>'.length + getEditButtons(solution).length
}

function getEditButtons(solution) {
  const id = solution.selectionId ? solution.selectionId: solution.id
  return `
    <i style="cursor: pointer"
      class="fa fa-pencil edit-selection-btn selection-button"
      data-selection-id="${id}"
    > &nbsp; </i>
    <i style="cursor: pointer"
      class="fa fa-trash delete-selection-btn selection-button"
      data-selection-id="${id}"
    > &nbsp;
    </i>
  `
}

function getWrapperSize() {

}
