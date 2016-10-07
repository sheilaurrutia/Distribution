import AbstractQuestionService from './AbstractQuestionService'


/**
 * Choice Question Service
 * @param {FeedbackService} FeedbackService
 * @constructor
 */
function BoundaryQuestionService($log, $timeout, FeedbackService) {
  AbstractQuestionService.call(this, $log, FeedbackService)
  this.$timeout = $timeout
}

// Extends AbstractQuestionCtrl
BoundaryQuestionService.prototype = Object.create(AbstractQuestionService.prototype)

BoundaryQuestionService.prototype.wavesurferOptions = {
  container: '#waveform',
  waveColor: '#172B32',
  progressColor: '#bbb',
  height: 256,
  interact: true,
  scrollParent: false,
  normalize: true,
  minimap: true
}

BoundaryQuestionService.prototype.wavesurferRegionOptions = {
  color: 'rgba(92,92,92,0.5)',
  drag: true,
  resize: true
}

BoundaryQuestionService.prototype.wavesurferMinimapOptions =  {
  height: 30,
  waveColor: '#ddd',
  progressColor: '#999',
  cursorColor: '#999'
}

BoundaryQuestionService.prototype.getLeftPostionFromTime = function getLeftPostionFromTime(time, wavesurfer) {
  const duration = wavesurfer.getDuration()
  const canvas = wavesurfer.container.children[0].children[0]
  const cWidth = canvas.clientWidth
  return time * cWidth / duration
}

BoundaryQuestionService.prototype.getTimeFromPosition = function getTimeFromPosition(position, wavesurfer) {
  const duration = wavesurfer.getDuration()
  const canvas = wavesurfer.container.children[0].children[0]
  const cWidth = canvas.clientWidth
  return position * duration / cWidth
}

BoundaryQuestionService.prototype.createRegion = function createRegion(start, end, wavesurfer){
  let startTime
  let endTime
  if(null !== start && null !== end){
    startTime = start
    endTime = end
  } else {
    const currentTime = wavesurfer.getCurrentTime()
    const duration = wavesurfer.getDuration()
    startTime = currentTime > 1 ? currentTime - 1 : 0
    endTime = currentTime < (duration - 1) ? currentTime + 1 : duration
  }

  const startMarker = {
    time: startTime,
    before: 0,
    after: 0
  }

  const endMarker = {
    time: endTime,
    before: 0,
    after: 0
  }

  return {
    uuid: '1',
    valid: true,
    start:startMarker,
    end:endMarker
  }
}

export default BoundaryQuestionService
