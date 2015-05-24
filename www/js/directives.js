angular.module('app.directives', [])
.directive('hackhappinesAddhackhappines', function(Happinesses) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'templates/addHappiness.html',
      compile: function(element, attr) {
        return function($scope)
        {
          // Perform the action when the user submits the login form
          $scope.addHappiness = function() {
            var happiness = new Happinesses($scope.happinessData);
            happiness.$save(function(newHappiness){
              $scope.happinesses.unshift(newHappiness);
              $scope.closeAddHappiness();
            });
          };
          
          var interval;
          $scope.startHappiness = function()
          {
            _increaseHappinessLevel();
            interval = setInterval(_increaseHappinessLevel, _increaseHappinessInterval);
          };
          $scope.stopHappiness = function()
          {
            clearInterval(interval);
            $scope.isHappinessLevelSet = true;
          };

          var _increaseHappinessInterval = 500;
          var _increaseHappinessLevel = function(){
            if( $scope.happinessData.level < $scope.happinessRangeMax )
            {
              $scope.happinessData.level++;
            }
          };
          $scope.initHappinesData = function()
          {
            $scope.happinessData = {
              level: 0,
              message: ''
            };
            $scope.isHappinessLevelSet = false;
          };
          $scope.initHappinesData();
        };
      }
    };
});