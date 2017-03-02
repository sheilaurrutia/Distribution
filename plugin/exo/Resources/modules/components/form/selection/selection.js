import rangy from 'rangy'

export function getOffsets(element, selection = null, html = null) {
  let toAdd = 0
  let i = 0
  let j = 0
  let forward = 0
  let addForTag = false
  let addForSpecialChar = false

  if (!selection) {
    selection = window.getSelection()
  }

  let range = selection.getRangeAt(0);
  let priorRange = range.cloneRange();
  priorRange.selectNodeContents(element);
  priorRange.setEnd(range.startContainer, range.startOffset);
  let start = priorRange.toString().length;
  let end = start + range.toString().length;

  const offsets = {
    start, end
  }

  if (!html) html = element.innerHTML

  while (i <= offsets.start) {

    if (html[j] === '<' ) {
      forward = getTillChar(html, j, '>')
    }

    if (html[j] === '&' ) {
      forward = getTillChar(html, j, ';')
      forward-- //we still have to add the special char !
    }

    toAdd += forward

    if (forward > 0) {
      j += forward
    } else {
        j++
        i++
    }

    forward = 0
  }

  offsets.trueStart = toAdd + offsets.start
  offsets.trueEnd = toAdd + offsets.end

  return offsets
}

function getTillChar(html, index, marker) {
  let keepGoing = true
  let length = 0

  for (let i = index; keepGoing === true; i++) {
    if (html[i] === marker) {
      keepGoing = false
    }
    length ++
  }

  return length
}
