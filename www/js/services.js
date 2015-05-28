angular.module('app.services', ['dpd'])

.factory('Happinesses', function(dpd) {
  return dpd.happinesses;
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
.factory('MarkersService', function($resource) {
  return {
    getFakeMarkers: function(lat, lng) {
      var markers = [];
      var createRandomMarker = function(i, lat, lng, idKey) {

        if (idKey === null) {
          idKey = "id";
        }

        var latitude = lat + (Math.random() * 0.01);
        var longitude = lng + (Math.random() * 0.01);

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

      for (var i = 0; i < 3; i++) {
        markers.push(createRandomMarker(i, lat, lng));
      }
      return markers;
    }
  };
});
