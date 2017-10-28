(function() {
  'use strict';

  angular.module('kidfriendly').controller('HomeController', HomeController);
  HomeController.$inject = ['HomeService', 'LocalityService', '$controller', '$state', '$timeout', '$scope', '$rootScope'];

  function HomeController(HomeService, LocalityService, $controller, $state, $timeout, $scope, $rootScope) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
    vm.suggestions = [];
    vm.nextToMe = [];
    vm.message = {
      suggestions: '',
      nextToMe: ''
    };

    initialize();

    vm.details = function(companyDto) {
      vm.go('main.home-company', {
        idCompany: companyDto.idCompany,
        desName: companyDto.desName,
        numRate: companyDto.numRate,
        desSite: companyDto.desSite
      }, true);
    };

    function listSuggestions() {
      vm.message.suggestions = '';
      vm.suggestions = [];
      vm.prevNextSuggestions = false;
      HomeService.listSuggestions().then(function(response) {
        if (!response.error) {
          vm.suggestions = vm.suggestions.concat(response.data);

          if (vm.suggestions.length === 0) {
            vm.message.suggestions = 'Nenhum estabelecimento.'
          } else {
            $timeout(function() {
              new Swiper(angular.element(document.querySelector('.swiper-container-suggestions')), {
                prevButton: '.swiper-button-prev-custom-suggestions',
                nextButton: '.swiper-button-next-custom-suggestions',
                spaceBetween: 10,
                effect: 'slide',
              });
              vm.prevNextSuggestions = vm.suggestions.length > 1;
            }, 100);
          }
        } else {
          vm.message.suggestions = response.message;
        }
      });
    }

    function listNextToMe() {
      vm.message.nextToMe = '';
      vm.nextToMe = [];
      vm.prevNextNextToMe = false;
      LocalityService.getGeolocation().then(function(response) {
        if (!response.error) {
          HomeService.listNextToMe(response.data).then(function(response) {
            if (!response.error) {
              vm.nextToMe = vm.nextToMe.concat(response.data);

              if (vm.nextToMe.length === 0) {
                vm.message.nextToMe = 'Nenhum estabelecimento.'
              } else {
                $timeout(function() {
                  new Swiper(angular.element(document.querySelector('.swiper-container-nexttome')), {
                    prevButton: '.swiper-button-prev-custom-nexttome',
                    nextButton: '.swiper-button-next-custom-nexttome',
                    spaceBetween: 10,
                    effect: 'slide'
                  });
                  vm.prevNextNextToMe = vm.nextToMe.length > 1;
                }, 100);
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

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (toState.name === 'main.home' && fromState.name !== 'main.home-company') {
        initialize();
      }
    });
  }
})();
