angular.module('app.services', [])

.factory('Happinesses', function($resource) {
  return $resource('http://hackhappiness.herokuapp.com/happinesses/:id', { happinessId:'@id' });
})
.factory('GeoService', function($resource) {
  return {
    map: {
      center: {
        latitude: 41.4,
        longitude: 2.16
      },
      zoom: 14,
      control: {},
      bounds: {}
    }
  };
})
.factory('PointsService', function($resource) {
  return {
    points: function(bounds) {
      var markers = [];
      var createRandomMarker = function(i, bounds, idKey) {
        var lat_min = bounds.southwest.latitude,
        lat_range = bounds.northeast.latitude - lat_min,
        lng_min = bounds.southwest.longitude,
        lng_range = bounds.northeast.longitude - lng_min;

        if (idKey == null) {
          idKey = "id";
        }

        var latitude = lat_min + (Math.random() * lat_range);
        var longitude = lng_min + (Math.random() * lng_range);
        var ret = {
          latitude: latitude,
          longitude: longitude,
          title: 'm' + i
        };
        ret[idKey] = i;
        return ret;
      };

      for (var i = 0; i < 50; i++) {
        markers.push(createRandomMarker(i, bounds))
      }
      return markers;
    }
  }
});
