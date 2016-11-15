export default function($compile) {
  return function(scope, element, attrs) {
    scope.$watch(attrs.bindHtml, function(html) {
      if (html) {
        element.html(html)
        $compile(element.contents())(scope)
      }
    })
  }
}
