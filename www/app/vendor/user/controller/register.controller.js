(function() {
  'use strict';

  angular.module('kidfriendly').controller('RegisterController', RegisterController);
  RegisterController.$inject = ['UserService', 'StatesPrepService', 'MinMaxDtBirthdayPrepService', 'LocalityService', '$scope', '$controller', '$cordovaCamera', '$ionicScrollDelegate'];

  function RegisterController(UserService, StatesPrepService, MinMaxDtBirthdayPrepService, LocalityService, $scope, $controller, $cordovaCamera, $ionicScrollDelegate) {
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

    vm.save = function() {
      if (vm.password.length < 6) {
        UserService.ionicPopupAlertAttention('Senha deve conter no mínimo 6 caracteres.');
        return;
      }

      vm.showLoading();
      vm.user.dtBirthDay = ((vm.dtBirthDay === null || angular.isUndefined(vm.dtBirthDay)) ? null : moment(vm.dtBirthDay).format());
      vm.user.city = ((vm.idCity === null || angular.isUndefined(vm.idCity)) ? null : {
        idCity: vm.idCity,
        state: {
          idState: vm.idState
        }
      });
      vm.user.login = {
        idLogin: vm.email,
        desPassword: sha256_digest(vm.email.concat(sha256_digest(vm.password))),
        stActive: true
      };
      UserService.include(vm.user).then(function(response) {
        if (response.error) {
          UserService.ionicPopupAlertError(response.message);
        } else {
          UserService.includeLocalStorage(response.data);
          UserService.ionicPopupAlertSuccess('Suas informações foram salvas.').then(function() {
            vm.go('main.home');
          });
        }

        vm.hideLoading();
      });
    }

    function initialize() {
      $scope.$on('$ionicView.beforeEnter', function() {
        $ionicScrollDelegate.scrollTop();
        vm.email = null;
        vm.password = null
        vm.user = {
          idUser: null,
          mgUser: null,
          dsName: null,
          dtBirthDay: null,
          genderEnum: null,
          nmChildren: null,
          idSocialNetwork: null
        };
        vm.minDtBirthDay = MinMaxDtBirthdayPrepService.data.minDate;
        vm.maxDtBirthDay = MinMaxDtBirthdayPrepService.data.maxDate;
        vm.dtBirthDay = null;
        vm.states = StatesPrepService.data;
        vm.idState = null;
        vm.cities = [];
        vm.idCity = null;
        vm.genders = UserService.getGenders();
        vm.timeoutHideLoading();
      });
    }
  }
})();