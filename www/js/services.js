angular.module('app.services', ['dpd', 'ngCookies'])

.factory('Users', function(dpd, $cookies, $q) {
  var Users = dpd.users;
  Users.current = function(){
    var deferred = $q.defer();
    Users.get('me')
      .success(function(user){
        if ( user )
        {
          $cookies.sid = user.id;
          deferred.resolve(user);
        }
        else
        {
          deferred.reject();
        }
      })
      .error(deferred.reject);
    return deferred.promise;
  };
  Users.register = function(data){
    var deferred = $q.defer();
    Users.post(data)
      .success(function(user){
        $cookies.sid = user.id;
        deferred.resolve(user);
      })
      .error(deferred.reject);
    return deferred.promise;
  };
  Users.login = function(data){
    var deferred = $q.defer();
    Users.exec('login', data)
      .success(function(user){
        $cookies.sid = user.id;
        deferred.resolve(user);
      })
      .error(deferred.reject);
    return deferred.promise;
  };
  Users.logout = function(){
    var deferred = $q.defer();
    Users.exec('logout')
      .success(function(user){
        $cookies.sid = null;
        deferred.resolve();
      })
      .error(deferred.reject);
    return deferred.promise;
  };
  return Users;
})
.factory('GeoService', function($resource, mapConfig) {
  return {
    geocoder: new google.maps.Geocoder(),
    getCurrentPosition: function(f) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          f.call(null, position);
        });
      } else {
        alert('Unable to locate current position');
      }
    },
    map: {
      center: mapConfig.center,
      zoom: mapConfig.zoom,
      control: {},
      bounds: {}
    }
  };
})
.factory('HappinessesService', function($resource, $q, dpd, mapConfig) {
  var Happinesses = dpd.happinesses;
  // Devuelve una lista de happinesses dentro de los límites del mapa que se está mostrando
  Happinesses.allByBox = function(lowerLeftCoord, upperRightCoord) {
    var deferred = $q.defer();
    var query = { "loc": {"$within": {"$box": [lowerLeftCoord, upperRightCoord]}}, $limit: mapConfig.happinessesQueryLimit };
    Happinesses.get(query, function(happinesses, err) {
      if (err.errors) deferred.reject();
      var response = [];
      happinesses.forEach(function(aHappinesses) {
        var ret = {
          id: aHappinesses.id,
          latitude: aHappinesses.loc[1],
          longitude: aHappinesses.loc[0],
          icon: 'img/icon.png',
        };
        response.push(ret);
      });
      deferred.resolve(response);
    });
    return deferred.promise;
  }
  return Happinesses;
});
