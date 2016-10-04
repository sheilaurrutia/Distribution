import AbstractQuestionService from './AbstractQuestionService'

import WaveSurfer from 'wavesurfer.js/dist/wavesurfer'
import 'wavesurfer.js/dist/plugin/wavesurfer.minimap.min'
import 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min'
import 'wavesurfer.js/dist/plugin/wavesurfer.regions.min'

/**
 * Choice Question Service
 * @param {FeedbackService} FeedbackService
 * @constructor
 */
function BoundaryQuestionService($log, FeedbackService) {
  AbstractQuestionService.call(this, $log, FeedbackService)
  //this.wavesurfer = null
}

// Extends AbstractQuestionCtrl
BoundaryQuestionService.prototype = Object.create(AbstractQuestionService.prototype)

BoundaryQuestionService.prototype.wavesurferOptions = {
  container: '#waveform',
  waveColor: '#172B32',
  progressColor: '#00A1E5',
  height: 256,
  interact: true,
  scrollParent: false,
  normalize: true,
  minimap: true
}

BoundaryQuestionService.prototype.wavesurfer = null
BoundaryQuestionService.prototype.question = null

BoundaryQuestionService.prototype.getWavesurferInstance = function getWavesurferInstance(){
  return this.wavesurfer
}

BoundaryQuestionService.prototype.setQuestion = function setWavesurferInstance(question){
  this.question = question
}

BoundaryQuestionService.prototype.getQuestion = function getQuestion(){
  return this.question
}


BoundaryQuestionService.prototype.getWavesurferInstance = function getWavesurferInstance(){
  return this.wavesurfer
}

/**
*/
BoundaryQuestionService.prototype.init = function init(question){
  this.setQuestion(question)
  this.wavesurfer = Object.create(WaveSurfer)
  const progressDiv = document.querySelector('#progress-bar')
  const progressBar = progressDiv.querySelector('.progress-bar')
  const showProgress = function (percent) {
    progressDiv.style.display = 'block'
    progressBar.style.width = percent + '%'
  }
  const hideProgress = function () {
    progressDiv.style.display = 'none'
  }
  this.wavesurfer.on('loading', showProgress)
  this.wavesurfer.on('ready', hideProgress)
  this.wavesurfer.on('destroy', hideProgress)
  this.wavesurfer.on('error', hideProgress)

  this.wavesurfer.init(this.wavesurferOptions)
  this.wavesurfer.initMinimap({
    height: 30,
    waveColor: '#ddd',
    progressColor: '#999',
    cursorColor: '#999'
  })
  this.wavesurfer.load(this.question.file.url)

  this.wavesurfer.on('ready', function () {
    const timeline = Object.create(WaveSurfer.Timeline)
    timeline.init({
      wavesurfer: this.wavesurfer,
      container: '#wave-timeline'
    })

  }.bind(this))
}

BoundaryQuestionService.prototype.play = function play(region){
  const playing = this.wavesurfer.isPlaying()
  if(playing){
    this.wavesurfer.pause()
  } else {
    if(undefined !== region && null !== region){
      this.wavesurfer.play(region.start.time, region.end.time)
    } else {
      this.wavesurfer.play()
    }
  }
}

BoundaryQuestionService.prototype.addRegion = function addRegion(){
  // start /end marker
  const currentTime = this.wavesurfer.getCurrentTime()
  const duration = this.wavesurfer.getDuration()
  const start = {
    time: currentTime > 1 ? currentTime - 1 : 0,
    before: 0,
    after: 0
  }

  const end = {
    time: currentTime < (duration - 1) ? currentTime + 1 : duration,
    before: 0,
    after: 0
  }

  return {
    valid: true,
    start:start,
    end:end
  }
}

export default BoundaryQuestionService
