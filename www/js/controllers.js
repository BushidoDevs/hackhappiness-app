angular.module('app.controllers', ['uiGmapgoogle-maps'])

.controller('MapCtrl', function($scope, GeoService, MarkersService, uiGmapIsReady) {

  uiGmapIsReady.promise(1).then(function(instances) {
    instances.forEach(function(inst) {
      
      ionic.Platform.ready(function() { 
        GeoService.getCurrentPosition(function (position) {
          $scope.map.control.refresh({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          );
        });
      });

    });
  });

  var updateMarkers = function(e) {

    if (typeof $scope.markers.control.updateModels == 'function') {
      $scope.markers.control.updateModels(
        MarkersService.getFakeMarkers(e.data.map.center.lat(), e.data.map.center.lng())
      );
    }
  };
  
  $scope.markers = {
    models: [],
    control: {}
  };
  $scope.map = GeoService.map;
  $scope.map.events = {
    // Al realizar un drag del mapa, se actualizan los markers.
    'bounds_changed' : updateMarkers
  };
})

.controller('TrendingCtrl', function($scope, $ionicModal, $state, Users, Happinesses, happinessRange) {
  $scope.happinesses = [];
  $scope.happinessRange = happinessRange;
  $scope.happinessRangeMin = $scope.happinessRange[0];
  $scope.happinessRangeMax = $scope.happinessRange[$scope.happinessRange.length - 1];

  Happinesses.get({
    $sort: {
      createdDate: -1
    }
  }).then(function(response){
    $scope.happinesses = response.data;
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
