(function() {
  'use strict';

  angular.module('kidfriendly').controller('UserController', UserController);
  UserController.$inject = ['UserService', '$controller', '$scope', 'statesPrepService', 'minMaxDtBirthdayPrepService',
    'LocalityService', '$cordovaCamera', '$state', 'LoginService'];

  function UserController(UserService, $controller, $scope, statesPrepService, minMaxDtBirthdayPrepService,
    LocalityService, $cordovaCamera, $state, LoginService) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm, '$scope': $scope}));
    vm.isVisible = false;
    vm.user = {};
    vm.states = [];
    vm.cities = [];
    vm.isIncludeUser = false;
    vm.isUpdateUser = false;
    vm.isUpdatePassword = false;
    initialize();

    vm.editAvatar = function(sourceType) {
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        'sourceType': sourceType,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
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
      vm.showLoading();
      defineUser();
      defineLogin();
      UserService.include(vm.user).then(function(response) {
        if (response.error) {
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

      if (vm.isUpdateUser) {
        updateUser();
      } else if (vm.isUpdatePassword) {
        updatePassword();
      }
    };

    function initialize() {
      if (statesPrepService.error || minMaxDtBirthdayPrepService.error) {
        vm.hideLoading();
        UserService.ionicPopupAlertError(((statesPrepService.error) ? statesPrepService.message : minMaxDtBirthdayPrepService.message)).then(function() {
          vm.goBack();
        });
      } else {
        $scope.$on('$ionicView.beforeEnter', function() {
          if ($state.params.params !== null) {
            vm.isIncludeUser = ((angular.isUndefined($state.params.params.isIncludeUser)) ? false : $state.params.params.isIncludeUser);
            vm.isUpdateUser = ((angular.isUndefined($state.params.params.isUpdateUser)) ? false : $state.params.params.isUpdateUser);
            vm.isUpdatePassword = ((angular.isUndefined($state.params.params.isUpdatePassword)) ? false : $state.params.params.isUpdatePassword);
          }

          if (!vm.isUserLogged()) {
            configureInclude();
          } else {
            configureUpdate();
          }

          vm.desPassword = null;
          vm.repeatDesPassword = null;
          vm.states = statesPrepService.data;
          vm.maxDate = minMaxDtBirthdayPrepService.data.maxDate;
          vm.minDate = minMaxDtBirthdayPrepService.data.minDate;
          vm.timeoutHideLoading();
          vm.isVisible = true;
        });
      }
    }

    function configureInclude() {
      vm.user = {
        idUser: null,
        mgUser: null,
        dsName: null,
        dtBirthDay: null,
        genderEnum: null,
        blHasChildren: null,
        idSocialNetwork: null
      };
      vm.dtBirthDay = null;
      vm.idState = null;
      vm.idCity = null;
      vm.idLogin = null;
    }

    function configureUpdate() {
      vm.user = angular.copy(vm.getUserLogged());

      if (vm.isUpdateUser) {
        vm.dtBirthDay = new Date(moment(vm.user.dtBirthDay));
        vm.idState = ((vm.user.city === null || vm.user.city.state === null) ? null : vm.user.city.state.idState);

        if (vm.idState !== null) {
          vm.listCityByState(vm.idState);
          vm.idCity = vm.user.city.idCity;
        }
      } else if (vm.isUpdatePassword) {
        vm.idLogin = ((vm.user.login === null) ? null : vm.user.login.idLogin);
      }
    }

    function defineUser() {
      vm.user.dtBirthDay = ((vm.dtBirthDay === null || angular.isUndefined(vm.dtBirthDay)) ? null : moment(vm.dtBirthDay).format());
      vm.user.city = ((vm.idCity === null || angular.isUndefined(vm.idCity)) ? null : {
        idCity: vm.idCity,
        state: {
          idState: vm.idState
        }
      });
    }

    function defineLogin() {
      vm.user.login = ((vm.idLogin === null || angular.isUndefined(vm.idLogin))? null : {
        idLogin: vm.idLogin,
        desPassword: sha256_digest(vm.desPassword),
        stActive: true,
        user: {
          idUser: vm.user.idUser
        }
      });
    }

    function updateUser() {
      defineUser();
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
    }

    function updatePassword() {
      defineLogin();
      LoginService.update(vm.user.login).then(function(response) {
        if (response.error) {
          LoginService.ionicPopupAlertError(response.message);
        } else {
          var userLogged = vm.getUserLogged();
          userLogged.login = response.data;
          LoginService.setLocalStorage('keyLocalStorageUser', userLogged);
          LoginService.ionicPopupAlertSuccess('Sua senha foi atualizada.').then(function() {
            vm.goBack();
          });
        }

        vm.hideLoading();
      });
    }
  }
})();
