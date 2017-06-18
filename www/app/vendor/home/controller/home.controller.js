(function() {
  'use strict';

  angular.module('kidfriendly').controller('HomeController', HomeController);
  HomeController.$inject = ['HomeService', 'LocalityService', '$scope', '$controller', '$state', '$timeout'];

  function HomeController(HomeService, LocalityService, $scope, $controller, $state, $timeout) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm, '$scope': $scope}));
    vm.suggestions = [];
    vm.nextToMe = [];
    vm.isShowNextToMe = false;
    vm.message = {
      nextToMe: ''
    };

    initialize();

    vm.details = function(company) {
      vm.go('main.home-company', {'primarykey': company.idCompany}, true);
    };

    /*
    function initialize(isShowMessageGeolocation) {
      
      /*$scope.$on('$ionicView.beforeEnter', function() {
        vm.hideLoading();
        console.log('passei aqui');
      });

      LocalityService.getGeolocation().then(function(response) {
        if (response.error && isShowMessageGeolocation) {
          vm.hideLoading();
          HomeService.ionicPopupAlertAttention(response.message).then(function() {
            vm.showLoading();
            listCompanies();
          });
        } else {
          listCompanies(response.data);
        }
      });
    }
    */

    function listSuggestions() {
      vm.suggestions = [];
      HomeService.listSuggestions().then(function(response) {
        if (!response.error) {
          vm.suggestions.concat(response.data);
          $timeout(function() {
            new Swiper(angular.element(document.querySelector('.swiper-container-gallery')), {
              prevButton: '.swiper-button-prev-gallery',
              nextButton: '.swiper-button-next-gallery',
              spaceBetween: 30,
              effect: 'slide',
              loop: true
            });
          }, 500);
        } else {
          console.log(response.message);
        }

        vm.timeoutHideLoading();
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
              console.log(response.message);
            }

            vm.timeoutHideLoading();
          });
        } else {
          vm.message.nextToMe = response.message;
        }
      });
    }

    function initialize() {
      vm.showLoading();
      listSuggestions();
      listNextToMe();
    }

    /*
    function listCompanies(longitudeLatitude) {
      HomeService.get(longitudeLatitude).then(function(response) {
        var suggestions = [];
        var nextToMe = [];

        if (!response.error) {
          suggestions = response.data.suggestions;
          nextToMe = response.data.nextToMe;

          if (suggestions.length === 0 && nextToMe.length === 0) {
            vm.hideLoading();
            HomeService.ionicPopupAlertAttention('Nenhum estabelecimento encontrado.');
          }
        } else {
          vm.hideLoading();
          HomeService.ionicPopupAlertError(response.message);
        }
        vm.suggestions = suggestions;
        //vm.nextToMe = nextToMe;
        vm.message.nextToMe = "Nenhum estabelecimento encontrado.";
        
        $timeout(function() {
          new Swiper(angular.element(document.querySelector('.swiper-container-gallery')), {
            prevButton: '.swiper-button-prev-gallery',
            nextButton: '.swiper-button-next-gallery',
            spaceBetween: 30,
            effect: 'slide',
            loop: true
          });
          new Swiper(angular.element(document.querySelector('.swiper-container-nexttome')), {
            slidesPerView: 4,
            centeredSlides: true,
            spaceBetween: 10,
            grabCursor: true
          });
          vm.isShowNextToMe = true;
        }, 600);
        vm.timeoutHideLoading();
      }).finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
    */
  }
})();
