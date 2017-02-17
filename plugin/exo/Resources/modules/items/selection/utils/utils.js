import {tex} from './../../../utils/translate'

export const utils = {}

utils.makeTinyHtml = (solution) => {
  let input = ''
  if (solution.answers.length === 1) {
  //if one solutions
    input = `
      <span class="cloze-input" data-hole-id="${solution.holeId}">
        <input
          style="width: auto; margin: 10px; display: inline;"
          class="hole-input form-control"
          data-hole-id="${solution.holeId}"
          type="text"
        >
        </input>
        ${getEditButtons(solution)}
      </span>
    `
  } else {
    input = `
      <span class="cloze-input" data-hole-id="${solution.holeId}">
        <select
          style="width: auto; margin: 10px; display: inline;"
          class="hole-input form-control"
          data-hole-id="${solution.holeId}"
          type="text"
        >
          <option> ${tex('please_choose')} </option>
        </select>
        ${getEditButtons(solution)}
      </span>
    `
  }
  return input
}

function getEditButtons(solution) {
  return `
    <i style="cursor: pointer"
      class="fa fa-pencil edit-hole-btn"
      data-hole-id="${solution.holeId}"
    > &nbsp; </i>
    <i style="cursor: pointer"
      class="fa fa-trash delete-hole-btn"
      data-hole-id="${solution.holeId}"
    > &nbsp;
    </i>
  `
}
