angular.module('app.controllers', [])

.controller('MapCtrl', function($scope) {})

.controller('TrendingCtrl', function($scope, $ionicModal, Happinesses) {
  $scope.happinesses = [];
  $scope.happinessRange = [1, 2, 3, 4, 5];
  var happinesses = Happinesses.query(function() {
    $scope.happinesses = happinesses;
  });
  
  $scope.addHappiness = 
  
  $scope.happinessData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/addHappiness.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeAddHappiness = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.openAddHappiness = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.addHappiness = function() {
    Happinesses.save($scope.happinessData, function(newHappiness){
      $scope.happinesses.unshift(newHappiness);
      $scope.closeAddHappiness();
    });
  };

})

.controller('AboutCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
