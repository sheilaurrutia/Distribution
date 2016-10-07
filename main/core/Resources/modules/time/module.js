import angular from 'angular/index'
import SecondsToHmsFilter from './Filters/SecondsToHmsFilter'

angular.module('time', [])
.filter('secondsToHms', [
  SecondsToHmsFilter
])
