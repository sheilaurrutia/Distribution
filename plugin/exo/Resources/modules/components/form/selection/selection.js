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
  let j = 0
  let forward = 0

  const html = element.innerHTML
  console.log('STAAART')

  while (i <= offsets.start) {

    console.log(i, html[j])
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
    if (html[i] === marker) {
      keepGoing = false
    }
    length ++
  }

  console.log('length toussa', length, html.substr(index, length))

  return length
}
