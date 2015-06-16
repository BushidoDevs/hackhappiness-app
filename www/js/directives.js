angular.module('app.directives', ['app.services'])
.directive('hackhappinesAddhackhappines', function(HappinessesService, GeoService, $interval, $state) {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    templateUrl: 'templates/addHappiness.html',
    compile: function(element, attr) {
      return function($scope)
      {
          $scope.isPositionSended = false;

          // Perform the action when the user submits the login form
          $scope.addHappiness = function() {

              var randomPhrase = Math.floor((Math.random() * 1) + 1);
              switch(randomPhrase){
                  case 1:
                      $scope.buttonMSG = 'Sending your happiness';
                      break;
              }

              GeoService.getCurrentPosition(function(position){
                  if(position.coords)
                  {
                      _setLocation(position.coords.latitude, position.coords.longitude);

                      GeoService.getStreetName(position.coords,
                          function onSuccess(info){
                              // $scope.happinessData.city
                              var googleCity = info.data.results[0].formatted_address;
                              var splitedGoogleCity = googleCity.split(',').reverse().splice(0,2);
                              $scope.happinessData.city = splitedGoogleCity.join();

                              HappinessesService.post($scope.happinessData)
                                  .success(function(){
                                      $scope.initHappinesData();
                                      $scope.isHappinessLevelSet = false;
                                      $scope.isPositionSended = true;
                                      setTimeout(function(){
                                          $state.go('app.map');
                                      }, 1000);
                                  });
                          }
                      );
                  }
                  $scope.geolocating = false;
              });
          };

          var interval;
          $scope.startHappiness = function()
          {
              _increaseHappinessLevel();
              interval = $interval(_increaseHappinessLevel, _increaseHappinessInterval);
          };
          $scope.stopHappiness = function()
          {
              $interval.cancel(interval);
              $scope.isHappinessLevelSet = true;
              $scope.addHappiness();
          };

          var _increaseHappinessInterval = 500;
          var _increaseHappinessLevel = function(){
              if( $scope.happinessData.level < $scope.happinessRangeMax )
              {
                  $scope.happinessData.level++;
              }
          };

          var _setLocation = function(lat, lng)
          {
              if( lat === null && lng === null )
              {
                  $scope.happinessData.loc = null;
                  $scope.happinessData.city = null;
                  $scope.happinessData.country = null;

              }
              else
              {
                  $scope.happinessData.loc = [lng, lat];
                  var latLng = new google.maps.LatLng(lat, lng);
                  GeoService.geocoder.geocode({latLng: latLng}, function(response, status) {
                      if (status == google.maps.GeocoderStatus.OK)
                      {
                          console.log(response);
                          if (response && response.length) {
                              var responseLength = response.length - 1;
                              if( responseLength > 1 )
                              {
                                  var formatted_address = response[responseLength-2].formatted_address;
                                  formatted_address = formatted_address.split(', ');
                                  $scope.happinessData.city = formatted_address[0];
                                  $scope.happinessData.country = formatted_address[1];
                              }
                              else
                              {
                                  $scope.happinessData.country = response[responseLength].formatted_address;
                                  $scope.happinessData.city = null;
                              }
                          }
                      }
                      else
                      {
                          console.error(status);
                      }
                      $scope.$digest();
                  });
              }
          };
          $scope.initHappinesData = function()
          {
              $scope.happinessData = {
                  level: 0,
                  message: ' ',
                  loc: []
              };
              $scope.allowGeolocale = false;
              $scope.geolocating = false;
              $scope.isHappinessLevelSet = false;
              $scope.toggleAllowGeolocale = function(){
                  if( $scope.allowGeolocale ) {
                      $scope.geolocating = true;
                      GeoService.getCurrentPosition(function(position){
                          if( $scope.geolocating )
                          {
                              _setLocation(position.coords.latitude, position.coords.longitude);
                          }
                          $scope.geolocating = false;
                      });
                  }
                  else
                  {
                      $scope.geolocating = false;
                      _setLocation(null, null);
                  }
              };

          };
          $scope.initHappinesData();
        };
      }
    };
  })

    .directive('hackhappinesHappyMeter', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: 'templates/happy-meter.html'
        };
    });