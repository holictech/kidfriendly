(function() {
  'use strict';

  angular.module('kidfriendly').controller('UserController', UserController);
  UserController.$inject = ['UserService', '$controller', '$scope', 'statesPrepService', 'minMaxDtBirthdayPrepService', 'LocalityService', '$cordovaCamera'];

  function UserController(UserService, $controller, $scope, statesPrepService, minMaxDtBirthdayPrepService, LocalityService, $cordovaCamera) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm, '$scope': $scope}));
    vm.isVisible = false;
    vm.user = {};
    vm.states = [];
    vm.cities = [];
    initialize();

    vm.editAvatar = function(sourceType) {
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        'sourceType': sourceType,
        allowEdit: true,
        encodingType: Camera.EncodingType.PNG,
        targetWidth: 100,
        targetHeight: 100,
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

    vm.include = function() {
      vm.user.login.stActive = true;
      vm.user.login.desPassword = md5(vm.user.login.desPassword);
      vm.showLoading();
      UserService.include(vm.user).then(function(response) {
        if (response.error) {
          vm.user.login.desPassword = null;
          vm.confirmPassword = null;
          UserService.ionicPopupAlertError(response.message);
        } else {
          UserService.setLocalStorage('keyLocalStorageUser', response.data);
          UserService.ionicPopupAlertSuccess('Suas informações foram cadastras.').then(function() {
            vm.goBack();
          });
        }

        vm.hideLoading();
      });
    };

    vm.update = function() {
      vm.showLoading();
      UserService.update(vm.user).then(function(response) {
        if (response.error) {
          UserService.ionicPopupAlertError(response.message);
        } else {
          UserService.setLocalStorage('keyLocalStorageUser', response.data);
          UserService.ionicPopupAlertSuccess('Suas informações foram atualizadas.').then(function() {
            vm.goBack();
          });
        }

        vm.hideLoading();
      });
    };

    function initialize() {
      if (statesPrepService.error || minMaxDtBirthdayPrepService.error) {
        vm.hideLoading();
        SearchService.ionicPopupAlertError(((statesPrepService.error) ? statesPrepService.message : minMaxDtBirthdayPrepService.message)).then(function() {
          vm.goBack();
        });
      } else {
        $scope.$on('$ionicView.beforeEnter', function() {
          vm.isVisible = true;
          vm.user = {
            mgUser: null,
            dsName: null,
            dtBirthDay: null,
            genderEnum: null,
            blHasChildren: null,
            idSocialNetwork: null,
            city: {
              state: {}
            },
            login: {}
          };
          vm.confirmPassword = null;
          vm.states = statesPrepService.data;
          vm.maxDate = minMaxDtBirthdayPrepService.data.maxDate;
          vm.minDate = minMaxDtBirthdayPrepService.data.minDate;
          vm.timeoutHideLoading();
        });
      }
    }
  }
})();
