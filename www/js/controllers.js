angular.module('app.controllers', ['uiGmapgoogle-maps'])

.controller('MapCtrl', function($scope, GeoService, HappinessesService, uiGmapIsReady) {
  // el mapa está preparado
  uiGmapIsReady.promise(1).then(function(instances) {
    instances.forEach(function(inst) {
      // la aplicación está preparada
      ionic.Platform.ready(function() {
        GeoService.getCurrentPosition(function (position) {
          $scope.map.control.refresh({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          );
          updateHappinesses();
        });
      });
    });
  });

  var updateHappinesses = function() {
    if (typeof $scope.markers.control.updateModels == 'function') {
      setTimeout(function() {
          var bounds = $scope.map.bounds;
          HappinessesService.allByBox([bounds.southwest.longitude, bounds.southwest.latitude],
                                      [bounds.northeast.longitude, bounds.northeast.latitude])
            .then($scope.markers.control.updateModels)
            .catch(console.error);
        }, 500);
    }
  };

  $scope.markers = {
    models: [],
    control: {}
  };
  $scope.map = GeoService.map;
  $scope.map.options =  {
    disableDefaultUI: !0,
    mapTypeControl: !1,
    tilt: 45
  };
  $scope.map.events = {
    // Al realizar un drag del mapa, se actualizan los happinesses.
    'dragend': updateHappinesses
  };
})

.controller('TrendingCtrl', function($scope, $ionicModal, $state, Users, HappinessesService) {
  $scope.happinesses = [];
  $scope.happinessRange = [1, 2, 3, 4, 5];

  $scope.meterConfig = {
    hideBar : true,
    staticPos: true
  };

  $scope.loadHappiness = function() {
    HappinessesService.get({
      $sort: {
        createdDate: -1
      }
    }).then(function (response) {
      $scope.happinesses = response.data;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.toDate = function(date){
    return date.toString().substr(0, 10);
  };

  $scope.loadHappiness();

})

.controller('AboutCtrl', function($scope) {

})

.controller('HomeCtrl', function($scope, HappinessesService, happinessRange, $state, uiGmapIsReady, GeoService, $timeout) {

  $scope.happinessRange = happinessRange;
  $scope.happinessRangeMin = $scope.happinessRange[0];
  $scope.happinessRangeMax = $scope.happinessRange[$scope.happinessRange.length - 1];

    // el mapa está preparado
    uiGmapIsReady.promise(1).then(function(instances) {
      console.log('map');

      instances.forEach(function(inst) {
        // la aplicación está preparada
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

    $scope.map = GeoService.map;
    $scope.map.options =  {
      disableDefaultUI: !0,
      mapTypeControl: !1,
      tilt: 45
    };

    $scope.reloadMap = false;
    $timeout(function(){
      $scope.reloadMap = true;
    }, 500);


})

.controller('AccountCtrl', function($scope, $ionicModal, $cookies, Users, HappinessesService, happinessRange) {
  var currentForm;
  var getCurrentUser = function(){
    return Users.current()
      .then(setUpAccount)
      .catch($scope.login);
  };
  var setUpAccount = function(user){
    $scope.user = user;
    $scope.getUserHappinesses();
  };
  $scope.getUserHappinesses = function(){
    HappinessesService.get({
      user: $scope.user.id,
      $sort: {
        createdDate: -1
      }
    }).then(function(response){
      $scope.happinesses = response.data;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  var loginSuccess = function(user){
    getCurrentUser().then($scope.closeAuth);
    $scope.auth.data = {};
    currentForm = null;
  };
  var logoutSuccess = function(){
    $cookies.sid = null;
    $scope.user = null;
  };
  $scope.$on('$ionicView.beforeEnter', getCurrentUser);
  $scope.happinessRange = happinessRange;
  $scope.auth = {
    action: 'login'
  };
  $scope.auth.setAuthAction = function(action) {
    $scope.auth.action = action;
  };
  $ionicModal.fromTemplateUrl("templates/modal-auth.html", {
    scope: $scope
  }).then(function(modal) {
    $scope.auth.modal = modal;
  });
  $scope.login = function() {
    $scope.auth.setAuthAction('login');
    $scope.auth.modal.show();
  };
  $scope.register = function() {
    $scope.auth.setAuthAction('register');
    $scope.auth.modal.show();
  };
  $scope.closeAuth = function(){
    $scope.auth.modal.hide();
  };

  $scope.meterConfig = {
    hideBar : true,
    staticPos: true
  };

  $scope.doRegister = function(form){
    currentForm = form;
    if(form.$valid)
    {
      Users.register($scope.auth.data)
        .then(function(user){
          $scope.doLogin(currentForm);
        })
        .catch(function(data){
          if( data && data.errors )
          {
            angular.forEach(data.errors, function(error, field){
              currentForm[field].serverMessage = error;
              currentForm[field].$setValidity('serverMessage', false);
            });
          }
          console.error(data);
        })
        .finally(form.$setPristine);
    }
  };
  $scope.doLogin = function(form){
    currentForm = form;
    if(form.$valid)
    {
      Users.login($scope.auth.data)
        .then(loginSuccess)
        .catch(function(data){
          if( data.message ){
            currentForm.password.$setValidity('serverMessage', false);
          }
          console.error(data);
        })
        .finally(form.$setPristine);
    }
  };
  $scope.doLogout = function(){
    Users.logout()
      .then(logoutSuccess)
      .catch(console.error);
  };



  $scope.toDate = function(date){
    return date.toString().substr(0, 10);
  };


})
.controller('LoginCtrl', function($scope, $ionicHistory) {
  // var backView = $ionicHistory.backView();
  // $ionicHistory.currentView(backView);
  // $ionicHistory.backTitle(backView.title);
})
.controller('RegisterCtrl', function($scope, $ionicHistory) {
  // var backView = $ionicHistory.backView();
  // $ionicHistory.currentView(backView);
  // $ionicHistory.backTitle(backView.title);
});