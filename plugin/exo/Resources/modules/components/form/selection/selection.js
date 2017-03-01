import rangy from 'rangy'

export function getOffsets(element) {
  let range = window.getSelection().getRangeAt(0);
  let priorRange = range.cloneRange();
  priorRange.selectNodeContents(element);
  priorRange.setEnd(range.startContainer, range.startOffset);
  let start = priorRange.toString().length;
  let end = start + range.toString().length;

  const offsets = {
    start, end
  }

  let toAdd = 0

  let addForTag = false
  let addForSpecialChar = false
  let i = 0
  let forward = 0

  const html = element.innerHTML

  while (i < html.length) {
    if (html[i] === '<' ) {
      forward = getTillChar(html, i, '>')
    }

    if (html[i] === '&' ) {
      forward = getTillChar(html, i, ';')
    }

    toAdd += forward

    i += forward + 1
    forward = 0
  }

  offsets.trueStart = offsets.start + toAdd
  offsets.trueEnd = offsets.end + toAdd

  console.log('innerHTML', html)
  console.log('textContent', element.textContent.substr(0, offsets.start))
  console.log('html', html.substr(0, offsets.trueStart))
  console.log(offsets)

  return offsets
}

function getTillChar(html, index, marker) {
  let keepGoing = true
  let length = 0

  for (let i = index; keepGoing === true; i++) {
    length ++
    if (html[i] === marker) {
      keepGoing = false
    }
  }

  return length
}
