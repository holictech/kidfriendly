(function() {
  'use strict';

  angular.module('kidfriendly').controller('HomeController', HomeController);
  HomeController.$inject = ['HomeService', 'LocalityService', '$controller', '$state', '$timeout', '$scope'];

  function HomeController(HomeService, LocalityService, $controller, $state, $timeout, $scope) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
    vm.suggestions = [];
    vm.nextToMe = [];
    vm.isShowNextToMe = false;
    vm.message = {
      suggestions: '',
      nextToMe: ''
    };

    initialize();

    vm.details = function(primarykey) {
      vm.go('main.home-company', {'primarykey': primarykey}, true);
    };

    function listSuggestions() {
      vm.message.suggestions = '';
      vm.suggestions = [];
      HomeService.listSuggestions().then(function(response) {
        if (!response.error) {
          vm.suggestions.concat(response.data);

          if (vm.suggestions.length === 0) {
            vm.message.suggestions = 'Nenhum estabelecimento.'
          } else {
            $timeout(function() {
              new Swiper(angular.element(document.querySelector('.swiper-container-gallery')), {
                prevButton: '.swiper-button-prev-gallery',
                nextButton: '.swiper-button-next-gallery',
                spaceBetween: 30,
                effect: 'slide',
                loop: true
              });
            }, 500);
          }
        } else {
          vm.message.suggestions = response.message;
        }
      });
    }

    function listNextToMe() {
      vm.message.nextToMe = '';
      vm.nextToMe = [];
      LocalityService.getGeolocation().then(function(response) {
        if (!response.error) {
          HomeService.listNextToMe(response.data).then(function(response) {
            if (!response.error) {
              vm.nextToMe.concat(response.data);

              if (vm.nextToMe.length === 0) {
                vm.message.nextToMe = 'Nenhum estabelecimento.'
              } else {
                $timeout(function() {
                  new Swiper(angular.element(document.querySelector('.swiper-container-nexttome')), {
                    slidesPerView: 4,
                    centeredSlides: true,
                    spaceBetween: 10,
                    grabCursor: true
                  });
                  vm.isShowNextToMe = true;
                }, 500);
              }
            } else {
              vm.message.nextToMe = response.message;
            }
          });
        } else {
          vm.message.nextToMe = response.message;
        }
      });
    }

    function initialize() {
      listSuggestions();
      listNextToMe();
    }

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (toState.name === 'main.home' && fromState.name !== 'main.home-company') {
        initialize();
      }
    });
  }
})();
