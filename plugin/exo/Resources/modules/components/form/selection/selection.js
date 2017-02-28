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

  const html = element.innerHTML

  html.split('').forEach((character, index) => {

    if (index < offsets.end) {
      if (character === '<') {
        toAdd += getTillChar(html, index, '>')
      }

      if (character === '&') {
        toAdd += getTillChar(html, index, ';')
      }
    }
  })

  offsets.trueStart = offsets.start + toAdd
  offsets.trueEnd = offsets.end + toAdd

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
