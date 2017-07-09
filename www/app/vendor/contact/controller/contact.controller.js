(function() {
  'use strict';

  angular.module('kidfriendly').controller('ContactController', ContactController);
  ContactController.$inject = ['ContactService', 'UserService', '$controller', '$scope', '$ionicScrollDelegate'];

  function ContactController(ContactService, UserService, $controller, $scope, $ionicScrollDelegate) {
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
        }
      }
      
      ContactService.contactUs(vm.emailDto).then(function(response) {
        if (response.error) {
          ContactService.ionicPopupAlertError(response.message);
        } else {
          ContactService.ionicPopupAlertSuccess('Mensagem enviada.').then(function() {
            vm.emailDto = createEmailDto();
          });
        }

        vm.hideLoading();
      });
    };

    function initialize() {
      $scope.$on('$ionicView.beforeEnter', function() {
        vm.emailDto = createEmailDto();
      });
    }

    function createEmailDto() {
      $ionicScrollDelegate.scrollTop();
      
      return {
        fromEmail: null,
        fromName: null,
        recipients: [],
        subject: 'Fale conosco - mobile',
        message: null
      };
    }
  }
})();