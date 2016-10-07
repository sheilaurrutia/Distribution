import AbstractQuestionCtrl from './AbstractQuestionCtrl'

import WaveSurfer from 'wavesurfer.js/dist/wavesurfer'
import 'wavesurfer.js/dist/plugin/wavesurfer.minimap.min'
import 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min'
import 'wavesurfer.js/dist/plugin/wavesurfer.regions.min'

/**
 * Period Question Controller
 * @param {FeedbackService}           FeedbackService
 * @param {$scope}                    $scope
 * @param {$timeout}                  $timeout
 * @param {$window}                   $window
 * @param {Translator}                Translator
 * @param {PeriodQuestionService}     PeriodQuestionService
 * @constructor
 */
function PeriodQuestionCtrl(FeedbackService, $scope, $timeout, $window, Translator, PeriodQuestionService) {
  AbstractQuestionCtrl.apply(this, arguments)

  this.PeriodQuestionService = PeriodQuestionService
  this.FeedbackService = FeedbackService
  this.$scope = $scope
  this.$timeout = $timeout
  this.$window = $window
  this.Translator = Translator
  this.init()
}

// Extends AbstractQuestionCtrl
PeriodQuestionCtrl.prototype = Object.create(AbstractQuestionCtrl.prototype)

// properties
PeriodQuestionCtrl.prototype.wavesurfer = null
PeriodQuestionCtrl.prototype.question = null
PeriodQuestionCtrl.prototype.regions = [] //this.Translator.trans('marker_drag_title', {}, 'ujm_exo')

/**
 * Init Wavesurfer and data
 */
PeriodQuestionCtrl.prototype.init = function init(){
  this.wavesurfer = Object.create(WaveSurfer)
  this.wavesurfer.on('loading', this.showProgress)
  this.wavesurfer.on('ready', this.hideProgress)
  this.wavesurfer.on('destroy', this.hideProgress)
  this.wavesurfer.on('error', this.hideProgress)

  this.wavesurfer.on('region-update-end', this.regionDragEndHandler.bind(this))
  this.wavesurfer.init(this.PeriodQuestionService.wavesurferOptions)
  this.wavesurfer.initMinimap(this.PeriodQuestionService.wavesurferMinimapOptions)
  this.wavesurfer.load(this.question.file.url)

  this.wavesurfer.on('ready', function () {
    const timeline = Object.create(WaveSurfer.Timeline)
    timeline.init({
      wavesurfer: this.wavesurfer,
      container: '#wave-timeline'
    })

  }.bind(this))
  this.wavesurfer.enableDragSelection({})

}

/**
 * Get the regions
 */
PeriodQuestionCtrl.prototype.getRegions = function getRegions() {
  return this.regions
}

/**
 * Show and update Wavesurfer progress-bar while loading
 * @param {number} percent
 */
PeriodQuestionCtrl.prototype.showProgress = function showProgress(percent) {
  const progressDiv = document.querySelector('#progress-bar')
  const progressBar = progressDiv.querySelector('.progress-bar')
  progressDiv.style.display = 'block'
  progressBar.style.width = percent + '%'
}

/**
 * Hide Wavesurfer progress-bar once loading has ended
 */
PeriodQuestionCtrl.prototype.hideProgress = function hideProgress() {
  const progressDiv = document.querySelector('#progress-bar')
  progressDiv.style.display = 'none'
}

/**
 * Play / Pause audio
 * @param {Object} region
 */
PeriodQuestionCtrl.prototype.play = function play(region){
  const playing = this.wavesurfer.isPlaying()
  if(playing){
    this.wavesurfer.pause()
  } else if(undefined !== region && null !== region) {
    this.wavesurfer.play(region.start.time, region.end.time)
  } else {
    this.wavesurfer.play()
  }
}

/**
 * Remove a given region from array and DOM
 */
PeriodQuestionCtrl.prototype.removeRegion = function removeRegion(region){
  const index = this.regions.indexOf(region)
  this.regions.splice(index, 1)
  // remove region from dom
  document.getElementById(region.uuid).remove()
  // re enable drag selection
  this.wavesurfer.enableDragSelection({})
}

/**
 * Remove all regions from array and DOM
 */
PeriodQuestionCtrl.prototype.clearRegions = function clearRegions(){
  this.regions = []
  let elements = document.getElementsByClassName('region')
  for(let elem of elements){
    elem.remove()
  }
}

/**
 * Create a region using Drag&Drop on the waveform
 * @param {Object} region WaveSurfer region
 */
PeriodQuestionCtrl.prototype.regionDragEndHandler = function regionDragEndHandler(region){
  // remove existing regions
  this.clearRegions()
  // create region from wavesurfer region data
  const start = region.start
  const end = region.end
  this.addRegion(start, end)
  // remove wavesurfer regions
  this.wavesurfer.clearRegions()
}

/**
 * Add a region (using the button)
 */
PeriodQuestionCtrl.prototype.mark = function mark() {
  if(this.regions.length === 0){
    this.addRegion(null, null)
  } else {
    return false
  }
}


/**
 * Add a region to regions array and create element on DOM
 * @param {number} start
 * @param {number} end
 */
PeriodQuestionCtrl.prototype.addRegion = function addRegion(start, end){
  // disable the ability to draw region directly on waveform (this is interracting badly with the current method)
  this.wavesurfer.disableDragSelection()
  const region = this.PeriodQuestionService.createRegion(start, end, this.wavesurfer)
  // need to apply scope if the creation come from a waveform drag&drop event
  this.$timeout(function () {
    this.$scope.$apply(function(){
      this.regions.push(region)
    }.bind(this))
  }.bind(this))
  this.drawRegion(region)
}

/**
 * Add region element on DOM and attach appropriate drag&drop events
 * @param {Object} region
 */
PeriodQuestionCtrl.prototype.drawRegion = function drawRegion(region) {

  const canvas = this.wavesurfer.container.children[0].children[0]
  const cHeight = canvas.clientHeight
  const left = this.getLeftPostionFromTime(region.start.time)
  const right = this.getLeftPostionFromTime(region.end.time)
  const markerWidth = 1
  const dragHandlerBorderSize = 1
  const dragHandlerSize = 18
  const dragHandlerTop = cHeight / 2 - dragHandlerSize / 2
  const dragHandlerLeft = dragHandlerBorderSize - dragHandlerSize / 2

  let startMarker = document.createElement('div')
  startMarker.className = 'marker start'
  startMarker.style.width = markerWidth + 'px'
  startMarker.dataset.time = region.start.time

  let endMarker = document.createElement('div')
  endMarker.className = 'marker end'
  endMarker.style.left = (right - left) + 'px'
  endMarker.style.width = markerWidth + 'px'
  endMarker.dataset.time = region.end.time

  let startMarkerDragHandler = document.createElement('div')
  startMarkerDragHandler.className = 'marker-drag-handler'
  startMarkerDragHandler.style.border = dragHandlerBorderSize + 'px solid white'
  startMarkerDragHandler.style.width = dragHandlerSize + 'px'
  startMarkerDragHandler.style.height = dragHandlerSize + 'px'
  startMarkerDragHandler.style.top = dragHandlerTop + 'px'
  startMarkerDragHandler.style.left = dragHandlerLeft + 'px'
  startMarkerDragHandler.title = this.Translator.trans('marker_drag_title', {}, 'ujm_exo')
  startMarkerDragHandler.dataset.uuid = region.uuid
  startMarkerDragHandler.dataset.type = 'start'

  let endMarkerDragHandler = document.createElement('div')
  endMarkerDragHandler.className = 'marker-drag-handler'
  endMarkerDragHandler.style.border = dragHandlerBorderSize + 'px solid white'
  endMarkerDragHandler.style.width = dragHandlerSize + 'px'
  endMarkerDragHandler.style.height = dragHandlerSize + 'px'
  endMarkerDragHandler.style.top = dragHandlerTop + 'px'
  endMarkerDragHandler.style.left = dragHandlerLeft + 'px'
  endMarkerDragHandler.title = this.Translator.trans('marker_drag_title', {}, 'ujm_exo')
  endMarkerDragHandler.dataset.uuid = region.uuid
  endMarkerDragHandler.dataset.type = 'end'

  let regionDiv = document.createElement('div')
  regionDiv.style.left = left + 'px'
  regionDiv.style.width = (right - left) + 'px'
  regionDiv.style.height = cHeight + 'px'
  regionDiv.className = 'region'
  regionDiv.dataset.uuid = region.uuid
  regionDiv.id = region.uuid

  startMarker.appendChild(startMarkerDragHandler)
  endMarker.appendChild(endMarkerDragHandler)
  regionDiv.appendChild(startMarker)
  regionDiv.appendChild(endMarker)
  this.wavesurfer.container.children[0].appendChild(regionDiv)

  let dragData
  startMarkerDragHandler.addEventListener('mousedown', function (event) {
    dragData = this.setDragData(event.target, region)
    this.$window.addEventListener('mousemove', moveMarker)
    this.$window.addEventListener('mouseup', dropMarker)
  }.bind(this))

  endMarkerDragHandler.addEventListener('mousedown', function (event) {
    dragData = this.setDragData(event.target, region)
    this.$window.addEventListener('mousemove', moveMarker)
    this.$window.addEventListener('mouseup', dropMarker)
  }.bind(this))


  // moving one marker
  let moveMarker = function moveMarker(event) {
    let rect = document.getElementById('waveform').getBoundingClientRect()
    let leftPos = event.pageX - rect.left - this.$window.pageXOffset
    let time = this.getTimeFromPosition(leftPos)
    // check drag limits
    if (leftPos > 0 && leftPos < rect.right && dragData.minTime < time && dragData.maxTime > time) {
      // udpate dom marker data-time attribute
      dragData.marker.dataset.time = time
      let regionDiv = dragData.marker.closest('.region')
      if(dragData.marker.dataset.type === 'start'){
        region.start.time = time
        regionDiv.style.left = leftPos + 'px'
        regionDiv.style.width = (this.getLeftPostionFromTime(region.end.time) - leftPos) + 'px'
      } else {
        region.end.time = time
        regionDiv.style.width = (leftPos - this.getLeftPostionFromTime(region.start.time)) + 'px'
      }
      regionDiv.querySelector('.end').style.left = regionDiv.style.width
    } else {
      return false
    }
  }.bind(this)

  let dropMarker = function dropMarker() {
    this.$window.removeEventListener('mousemove', moveMarker)
    this.$window.removeEventListener('mouseup', dropMarker)
    this.$scope.$apply(function () {
      if(dragData.marker.dataset.type === 'start'){
        region.start.time = Number(dragData.marker.dataset.time)
      } else {
        region.end.time = Number(dragData.marker.dataset.time)
      }
    })
  }.bind(this)

}

/**
 * @param  {Object} marker target of the event
 * @param  {Object} region the region related to the current dragged marker
 * @return {Object} data a set of usefull data while dragging
 */
PeriodQuestionCtrl.prototype.setDragData = function setDragData(marker, region) {
  let data = {}

  // set marker drag limits (left / right limits depending on the marker type)
  const min = marker.dataset.type === 'start' ? 0 : region.start.time
  const max = marker.dataset.type === 'start' ? region.end.time : this.wavesurfer.getDuration()

  data = {
    minTime: min,
    maxTime: max,
    marker: marker
  }
  return data
}

/**
 * @return a (left) position (relative to waveform canvas) from a given time (seconds)
 */
PeriodQuestionCtrl.prototype.getLeftPostionFromTime = function getLeftPostionFromTime(time) {
  return this.PeriodQuestionService.getLeftPostionFromTime(time, this.wavesurfer)
}

/**
 * @return a time from a given position
 */
PeriodQuestionCtrl.prototype.getTimeFromPosition = function getTimeFromPosition(position) {
  return this.PeriodQuestionService.getTimeFromPosition(position, this.wavesurfer)
}



export default PeriodQuestionCtrl
