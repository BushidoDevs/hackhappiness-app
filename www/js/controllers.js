angular.module('app.controllers', ['uiGmapgoogle-maps'])

.controller('MapCtrl', function($scope, GeoService, PointsService, uiGmapIsReady) {

  uiGmapIsReady.promise(1).then(function(instances) {
    instances.forEach(function(inst) {
      $scope.markers = PointsService.points($scope.map.bounds);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          $scope.map.control.refresh({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        });
      } else {
        alert('Unable to locate current position');
      }
    });
  });

  $scope.markers = [];
  $scope.map = GeoService.map;
})

.controller('TrendingCtrl', function($scope, $ionicModal, Happinesses) {
  $scope.happinesses = [];
  $scope.happinessRange = [1, 2, 3, 4, 5];
  $scope.happinessRangeMin = $scope.happinessRange[0];
  $scope.happinessRangeMax = $scope.happinessRange[$scope.happinessRange.length - 1];

  var happinesses = Happinesses.query(function() {
    $scope.happinesses = happinesses;
  });

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/addHappinessModal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the modal to close it
  $scope.closeAddHappiness = function() {
    $scope.modal.hide();
  };

  // Open the modal
  $scope.openAddHappiness = function() {
    $scope.modal.show();
  };
})

.controller('AboutCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
