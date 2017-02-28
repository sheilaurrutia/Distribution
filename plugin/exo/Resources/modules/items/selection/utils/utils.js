import {tex} from './../../../utils/translate'

export const utils = {}

utils.makeTextHtml = (text, solutions) => {
  return text
  //reorder solutions here by first/last position

  let idx = 0
  console.log(solutions)

  solutions.forEach(solution => {
    console.log('olololol')
    //txt1.slice(0, 3) + "bar" + txt1.slice(3);
    text = text.slice(0, solution.begin + idx)
    + getFirstSpan()
    + text.slice(solution.begin + idx, solution.end + idx)
    + '</span>'
    + getEditButtons(solution)
    + text.slice(solution.end + idx)

    idx += getHtmlLength(solution);
  })



  return text
}

function getFirstSpan() {
  return '<span class="well">';
}

function getHtmlLength(solution) {
  return getFirstSpan().length + getEditButtons(solution).length + '</span>'.length + getEditButtons(solution).length
}

function getEditButtons(solution) {
  return `
    <i style="cursor: pointer"
      class="fa fa-pencil edit-selection-btn"
      data-selection-id="${solution.selectionId}"
    > &nbsp; </i>
    <i style="cursor: pointer"
      class="fa fa-trash delete-selection-btn"
      data-selection-id="${solution.selectionId}"
    > &nbsp;
    </i>
  `
}

function getWrapperSize() {

}
