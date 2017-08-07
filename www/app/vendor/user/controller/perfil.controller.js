(function() {
  'use strict';

  angular.module('kidfriendly').controller('PerfilController', PerfilController);
  PerfilController.$inject = ['UserService', 'StatesPrepService', 'MinMaxDtBirthdayPrepService', 'LocalityService', '$scope', '$controller', '$cordovaCamera', '$state', 'ngFB', '$ionicScrollDelegate'];

  function PerfilController(UserService, StatesPrepService, MinMaxDtBirthdayPrepService, LocalityService, $scope, $controller, $cordovaCamera, $state, ngFB, $ionicScrollDelegate) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
    initialize();

    vm.getPicture = function(sourceType) {
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        'sourceType': sourceType,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        mediaType: Camera.MediaType.PICTURE,
        correctOrientation: true,
        saveToPhotoAlbum: false,
        popoverOptions: CameraPopoverOptions,
        cameraDirection: Camera.Direction.FRONT
      };

      $cordovaCamera.getPicture(options).then(function(DATA_URL) {
        vm.user.mgUser = DATA_URL;
      });
    };

    vm.listCityByState = function(idState) {
      vm.cities = [];

      if (idState !== null) {
        vm.showLoading();
        LocalityService.listCityByState(idState).then(function(response) {
          vm.cities = response.data;
          vm.hideLoading();
        }, function(response) {
          LocalityService.ionicPopupAlertError(response.message);
          vm.hideLoading();
        });
      }
    };

    vm.logout = function() {
      if (vm.user.idSocialNetwork !== null) {
        ngFB.logout().then(function() {
          _logout();
        }, function(error) {
          UserService.ionicPopupAlertError(error.message);
        });
      } else {
        _logout();
      }
    };

    vm.save = function() {
      vm.showLoading();
      vm.user.dtBirthDay = ((vm.dtBirthDay === null || angular.isUndefined(vm.dtBirthDay)) ? null : moment(vm.dtBirthDay).format());
      vm.user.city = ((vm.idCity === null || angular.isUndefined(vm.idCity)) ? null : {
        idCity: vm.idCity,
        state: {
          idState: vm.idState
        }
      });
      UserService.update(vm.user).then(function(response) {
        if (response.error) {
          UserService.ionicPopupAlertError(response.message);
        } else {
          UserService.includeLocalStorage(response.data);
          UserService.ionicPopupAlertSuccess('Suas informações foram salvas.');
        }

        vm.hideLoading();
      });
    };

    function _logout() {
      UserService.logout();
      vm.go('main.user-login');
    }

    function initialize() {
      $scope.$on('$ionicView.beforeEnter', function() {
        $ionicScrollDelegate.scrollTop();
        vm.user = angular.copy(UserService.getUserLogged());
        vm.minDtBirthDay = MinMaxDtBirthdayPrepService.data.minDate;
        vm.maxDtBirthDay = MinMaxDtBirthdayPrepService.data.maxDate;
        vm.dtBirthDay = (vm.user.dtBirthDay === null) ? null : new Date(moment(vm.user.dtBirthDay));
        vm.states = StatesPrepService.data;
        vm.idState = ((vm.user.city === null || vm.user.city.state === null) ? null : vm.user.city.state.idState);
        vm.cities = [];
        vm.idCity = null;

        if (vm.idState !== null) {
          vm.listCityByState(vm.idState);
          vm.idCity = vm.user.city.idCity;
        } else {
          vm.timeoutHideLoading();
        }

        vm.genders = UserService.getGenders();
      });
    }
  }
})();