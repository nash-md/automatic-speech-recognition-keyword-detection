angular.module('app', []);

function ApplicationController ($scope, $window, $http, $log, $sce) {
  $scope.getDeviceId = () => {
    return Math.random().toString(36).slice(2);
  };

  $scope.call = { sid: null, to: '', status: '' };
  $scope.sync = { client: null, state: 'unknown', sid: null, text: '', call: { sid: null, to: null, status: null } };

  $scope.labels = ['Sales', 'Support'];
  $scope.identity = $scope.getDeviceId();
  $scope.phone = '';
  $scope.language = 'en-US';

   $scope.call = function (index) {
    const payload = {
      identity: $scope.identity,
      language: $scope.language,
      phone: $scope.phone,
      labels: $scope.labels,
    };

    $http.post('/api/call', JSON.stringify(payload))
      .then((response) => {
        console.log(response);
      }).catch((error) => {
        console.log(error);
      });
  };
}

angular
  .module('app')
  .controller('ApplicationController', ApplicationController);
