(function() {
  'use strict';

  angular.module('kidfriendly').controller('IndicateController', IndicateController);
  IndicateController.$inject = ['ContactService', 'UserService', 'LocalityService', '$controller', '$scope', '$ionicScrollDelegate'];

  function IndicateController(ContactService, UserService, LocalityService, $controller, $scope, $ionicScrollDelegate) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
    initialize();

    vm.send = function() { 
      vm.showLoading();

      if (vm.isLogged()) {
        var user = UserService.getUserLogged();
        vm.emailDto.fromName = user.dsName;

        if (!vm.isLoggedSocialNetwork()) {
          vm.emailDto.fromEmail = user.login.idLogin;
        } else if (!vm.isLoggedSocialNetworkNotEmail()) {
          vm.emailDto.fromEmail = user.emailSocialNetwork;
        }
      };

      var message = 'Estabelecimento: ' + vm.establishment + '\n\r';
      message += 'Endereço: ' + vm.address + '\n\r';
      message += (vm.comment == null) ? '' : 'Comentário:\n\r' + vm.comment;
      vm.emailDto.message = message;
      ContactService.indicate(vm.emailDto).then(function(response) {
        if (response.error) {
          ContactService.ionicPopupAlertError(response.message);
        } else {
          ContactService.ionicPopupAlertSuccess('Agradecemos a sua indicação.').then(function() {
            toClean();
          });
        }

        vm.hideLoading();
      });
    };

    vm.getLocation = function() {
      vm.showLoading();
      LocalityService.formattedAddress().then(function(response) {
        if (!response.error) {
          vm.address = response.data;
        } else {
          LocalityService.ionicPopupAlertError(response.message);
        }

        vm.hideLoading();
      });
    };

    function initialize() {
      $scope.$on('$ionicView.beforeEnter', function() {
        toClean();

        if (!vm.isLogged()) {
          ContactService.ionicPopupAlertAttention('É necessário estar logado para indicar estabelecimento.').then(function() {
            vm.go('main.user-login', {view: 'main.indicate', parameter: null, loading: false});
          });
        }
      });
    }

    function toClean() {
      $ionicScrollDelegate.scrollTop();
      vm.establishment = null;
      vm.address = null;
      vm.comment = null;
      vm.emailDto = {
        fromEmail: null,
        fromName: null,
        recipients: [],
        subject: 'Indicação - mobile',
        message: null
      };
    }
  }
})();