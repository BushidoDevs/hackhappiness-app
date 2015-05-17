angular.module('app.services', [])

.factory('Happinesses', function($resource) {
  return $resource('http://hackhappiness.herokuapp.com/happinesses/:id', { happinessId:'@id' });
});
