import $ from 'jquery'

export default function ($scope, portfolioManager, widgetsManager, commentsManager, $attrs, widgetsConfig, assetPath, $modal, $timeout) {
  $scope.portfolio = portfolioManager.getPortfolio($attrs['portfolioContainer'])
  $scope.portfolio.$promise.then(function () {
    $scope.portfolioWidgets = widgetsManager.portfolioWidgets
    $scope.comments = commentsManager.comments
  })

  $scope.widgetTypes = widgetsConfig.getTypes(true)
  $scope.assetPath = assetPath
  $scope.isAdding = false
  $scope.isFetching = false

  $scope.setAddingMode = function (addingMode) {
    $scope.isAdding = addingMode
  }
  $scope.setFetchingMode = function (fetchingMode) {
    $scope.isFetching = fetchingMode
  }

  $scope.createWidget = function (type) {
    $scope.setAddingMode(false)
    $scope.setFetchingMode(true)

    var modalInstance = $modal.open({
      backdrop: false,
      animation: true,
      templateUrl: 'widget_picker_modal.html',
      controller: 'widgetPickerController',
      size: 'lg',
      resolve: {
        portfolioWidgets: function () {
          return widgetsManager.getAvailableWidgetsByTpe($scope.portfolio.id, type)
        },
        selectedPortfolioWidget: function () {
          return null
        }
      }
    })

    modalInstance.opened.then(function () {
      $scope.setFetchingMode(false)
    })

    modalInstance.result.then(function (selectedWidgets) {
      widgetsManager.addWidgets(selectedWidgets)
    })

  /*
   Small code to avoid https://github.com/angular-ui/bootstrap/issues/3633
   Solution come from https://github.com/angular-ui/bootstrap/issues/3633#issuecomment-110166992
   */
    modalInstance.result.finally(function () {
      $timeout(function () {
        $('.modal:last').trigger('$animate:close')
        $timeout(function () {
          $('.modal-backdrop:last').trigger('$animate:close')
        }, 100)
      }, 100)
    })
  }

  $scope.edit = function () {
    portfolioManager.rename($scope.portfolio)
  }

  $scope.save = function () {
    return portfolioManager.save($scope.portfolio)
  }

  $scope.cancelRename = function () {
    portfolioManager.cancelRename($scope.portfolio)
  }

  $scope.getId = function (portfolioWidget) {
    return portfolioWidget.id ? portfolioWidget.id : window._.uniqueId('wdg_')
  }

  $scope.gridsterOptions = {
    columns: 16, // the width of the grid, in columns
    swapping: true, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
    floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
    margins: [10, 10], // the pixel distance between each widget
    minColumns: 1, // the minimum columns the grid must have
    minRows: 1, // the minimum height of the grid, in rows
    maxRows: 100,
    resizable: {
      enabled: true,
      handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
      start: function () {}, // optional callback fired when resize is started,
      stop: function () {
        for (var index = 0; index < $scope.portfolioWidgets.length; index++) {
          var widget = $scope.portfolioWidgets[index]
          if (widget.toSave && !widget.isEditing) {
            widgetsManager.save(widget).then(function () {
              widget.toSave = false
            })
          }
        }
      } // optional callback fired when item is finished resizing
    },
    draggable: {
      enabled: true, // whether dragging items is supported
      handle: '.panel-heading .draggable-handle', // optional selector for resize handle
      start: function () {}, // optional callback fired when drag is started,
      stop: function () {
        for (var index = 0; index < $scope.portfolioWidgets.length; index++) {
          var widget = $scope.portfolioWidgets[index]
          if (widget.toSave) {
            widgetsManager.save(widget).then(function () {
              widget.toSave = false
            })
          }
        }
      } // optional callback fired when item is finished dragging
    }
  }
}
