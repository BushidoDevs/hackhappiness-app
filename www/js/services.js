angular.module('app.services', [])

.factory('Happinesses', function($resource) {
  return $resource('http://hackhappiness.herokuapp.com/happinesses/:id', { happinessId:'@id' });
})
.factory('GeoService', function($resource) {
  return {
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
        var lat_min = bounds.Da.A,
        lat_range = bounds.Da.j - lat_min,
        lng_min = bounds.va.j,
        lng_range = bounds.va.A - lng_min;

        if (idKey == null) {
          idKey = "id";
        }

        var latitude = lat_min + (Math.random() * lat_range);
        var longitude = lng_min + (Math.random() * lng_range);
        var ret = {
          latitude: latitude,
          longitude: longitude,
          title: 'm' + i,
          icon: 'img/icon.png',
          options: {
            labelContent: 'HackHappiness',
            labelClass: 'label-background'
          }
        };
        ret[idKey] = i;
        return ret;
      };

      for (var i = 0; i < 20; i++) {
        markers.push(createRandomMarker(i, bounds))
      }
      return markers;
    }
  }
});
