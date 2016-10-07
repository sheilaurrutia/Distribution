import period from './../Partials/period.html'

export default function PeriodCorrectionDirective() {
  return {
    restrict: 'E',
    replace: true,
    controller: 'PeriodCorrectionCtrl',
    controllerAs: 'periodCorrectionCtrl',
    bindToController: true,
    template: period,
    scope: {
      question: '=',
      showScore: '='
    }
  }
}
