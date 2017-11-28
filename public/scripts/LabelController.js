function LabelController ($scope, $log, $sce) {
  $scope.name = '';

  $scope.add = function () {
    if (!$scope.name) {
      return;
    }

    for (const label of $scope.labels) {
      if (label === $scope.name) {
        $scope.name = '';
        return;
      }
    }

    $scope.labels.push($scope.name);
    $scope.name = '';
  };

  $scope.remove = function (index) {
    $scope.labels.splice(index, 1);
  };
}

angular
  .module('app')
  .controller('LabelController', LabelController);
