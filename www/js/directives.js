angular.module('app.directives', ['app.services'])
.directive('hackhappinesAddhackhappines', function(Happinesses, GeoService) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/addHappiness.html',
    compile: function(element, attr) {
      return function($scope)
      {
          // Perform the action when the user submits the login form
          $scope.addHappiness = function() {
            Happinesses.post($scope.happinessData)
              .success($scope.closeAddHappiness);
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

          var _setLocation = function(lat, lng)
          {
            if( lat === null && lng === null )
            {
              $scope.happinessData.latlng = null;
              $scope.happinessData.city = null;
              $scope.happinessData.country = null;

            }
            else
            {
              $scope.happinessData.latlng = {
                lat: lat,
                lng: lng
              };
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
              message: '',
              latlng: {}
            };
            $scope.allowGeolocale = false;
            $scope.geolocating = false;
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
            $scope.isHappinessLevelSet = false;
          };
          $scope.initHappinesData();
        };
      }
    };
  });