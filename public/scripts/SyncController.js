function SyncController ($scope, $http, $log, $sce) {
  $scope.getToken = function () {
    const payload = { identity: $scope.identity };

    $http.post('/api/token', payload)
      .then(function onSuccess (response) {
        try {
          $scope.sync.client = new Twilio.Sync.Client(response.data.token);
          $scope.sync.sid = response.data.sid;
        } catch (error) {
          $log.error(error);
          $scope.sync.state = 'Error, check JavaScript Console';
        }

        $scope.sync.client.on('connectionStateChanged', function (state) {
          $log.log('Sync Client: ' + state);

          $scope.sync.state = state;
          $scope.$apply();

          if (state === 'connected') {
            $scope.subscribePartialResultDocument();
          }
        });
      }, function onError (response) {
        $log.error(response);
        $scope.state = `Sync Token Error: ${response.status} (${response.statusText})`;
      });
  };

  $scope.subscribePartialResultDocument = function () {
    $log.log('Sync Document: ' + $scope.sync.sid);

    $scope.sync.client.document($scope.sync.sid)
      .then(function (document) {
        $scope.sync.text = document.value.text;
        $scope.$apply();

        document.on('updatedRemotely', function (data) {
          $log.log($scope.sync.sid + ' updated remotely ... %o', data);
          $scope.sync.text = data.text;
          $scope.sync.call = data.call;

          $scope.$apply();
        });
      }).catch(function (error) {
        $log.error(error);
      });
  };
}

angular
  .module('app')
  .controller('SyncController', SyncController);
