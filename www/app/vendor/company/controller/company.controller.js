(function() {
  'use strict';

  angular.module('kidfriendly').controller('CompanyController', CompanyController);
  CompanyController.$inject = ['CompanyService', 'ImageService', 'FoodTypeService', 'RatingService', 'LocalityService', '$controller', '$scope', '$ionicScrollDelegate', '$stateParams', '$timeout', '$ionicModal', '$cordovaInAppBrowser', '$filter'];

  function CompanyController(CompanyService, ImageService, FoodTypeService, RatingService, LocalityService, $controller, $scope, $ionicScrollDelegate, $stateParams, $timeout, $ionicModal, $cordovaInAppBrowser, $filter) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
    vm.companyDto = null;
    vm.message = {
      'images': '',
      'foodTypes': '',
      'ratings': ''
    };
    vm.images = [];
    vm.rating = {};
    vm.visibleIconRating = true;
    vm.foodTypes = [];
    var ratingPaginatorDto = {
      currentPage: 0,
      pageSize: 5
    };
    vm.ratings = [];
    vm.isInfiniteScrollRating = false;
    vm.loadingRating = false;
    vm.phones = []
    vm.weeks = [];
    vm.characteristics = [];
    initialize();

    vm.openRating = function() {
      if (!vm.isLogged()) {
        CompanyService.ionicPopupAlertAttention('É necessário estar logado para avaliar o estabelecimento.');
      } else {
        vm.rating = {
          company: null,
          statusKidFriendly: null,
          user:null
        }
        vm.showLoading();
        RatingService.hasPermission(vm.companyDto.idCompany, vm.getUserLogged().idUser).then(function(response) {
          if (!response.error && response.data) {
            $timeout(function() {
              vm.visibleIconRating = false;
            }, 400);
            openModal('app/view/company/rating-modal.html');
          } else if (!response.error && !response.data) {
            RatingService.ionicPopupAlertAttention('Você avaliou este estabelecimento a menos de um mês.');
          } else {
            RatingService.ionicPopupAlertError(response.message);
          }

          vm.hideLoading();
        });
      }
    };

    vm.selectedStatusRating = function($event, idStatusKidFriendly) {
      vm.rating.statusKidFriendly = {
        idStatusKidFriendly: idStatusKidFriendly
      };

      angular.forEach(document.querySelectorAll('.notSelectedStatusKidFriendly'), function(value, key) {
        angular.element(value)[0].classList.remove('selectedStatusKidFriendly');
      });

      event.srcElement.classList.add('selectedStatusKidFriendly');
    };

    vm.includeRating = function() {
      vm.rating.company = {idCompany: vm.companyDto.idCompany};
      vm.rating.user = {idUser: vm.getUserLogged().idUser};
      vm.showLoading();
      RatingService.include(vm.rating).then(function(response) {
        vm.hideLoading();

        if (response.error) {
          RatingService.ionicPopupAlertError(response.message);
        } else {
          RatingService.ionicPopupAlertSuccess('Obrigado por avaliar. Em breve seu comentário estará disponível.').then(function() {
            vm.closeModalRating();
          });
        }
      });
    }

    vm.closeModalRating = function() {
      vm.visibleIconRating = true;
      vm.closeModal()
    };

    vm.openDetails = function() {
      openModal('app/view/company/details-modal.html');
    };

    vm.openSite = function(url) {
      $cordovaInAppBrowser.open(url, '_system');
      $cordovaInAppBrowser.close();
    };

    vm.closeModal = function() {
      if (angular.isDefined(vm.modal)) {
        vm.modal.hide();
      }
    }

    vm.launchNavigator = function($event) {
      vm.showLoading();
      LocalityService.getGeolocation().then(function(response) {
        if (response.error) {
          LocalityService.ionicPopupAlertAttention(response.message);
        } else {
          var destination = '' + vm.companyDto.addressDto.numLatitude + ', ' + vm.companyDto.addressDto.numLongitude + '';
          var start = '' + response.data.latitude + ', ' + response.data.longitude + '';

          launchnavigator.navigate(destination, {
            'start': start,
            'appSelection': {
              'dialogHeaderText': 'Qual aplicativo para navegação?',
              'cancelButtonText': 'Cancelar',
              'list': [launchnavigator.APP.GOOGLE_MAPS, launchnavigator.APP.APPLE_MAPS, launchnavigator.APP.WAZE]
            }
          });
        }

        vm.hideLoading();
      });
    };

    vm.moreRatings = function() {
      findRatings();
    };

    function findDetails() {
      vm.phones = []
      vm.weeks = [];
      vm.characteristics = [];
      CompanyService.details(vm.companyDto.idCompany).then(function(response) {
        if (response.error) {
          CompanyService.ionicPopupAlertError(response.message);
        } else {
          var address = response.data.address;
          var formattedAddress = address.desStreet;
          formattedAddress += ', nº ' + address.numStreet;
          formattedAddress += address.desComplement === null ? '' : ', ' + address.desComplement;
          formattedAddress += ', ' + address.desNeighborhood;
          formattedAddress += ', ' + address.city.desCity + '-' + address.city.state.desSigla
          formattedAddress += ', ' + $filter('mask')(address.descCode, '00000-000') + '.';
          vm.companyDto.addressDto = {
            formattedAddress: formattedAddress,
            numLatitude: address.numLatitude,
            numLongitude: address.numLongitude
          };
          vm.phones = vm.phones.concat(response.data.phones);
          vm.weeks = vm.weeks.concat(response.data.weeks);
          vm.characteristics = vm.characteristics.concat(response.data.characteristics);
        }
      });
    }

    function findImages() {
      vm.message.images = '';
      vm.images = [];
      vm.prevNextVisibled = false;
      ImageService.listByCompany(vm.companyDto.idCompany).then(function(response) {
        if (response.error) {
          vm.message.images = response.message;
        } else {
          vm.images = vm.images.concat(response.data);

          if (vm.images.length === 0) {
            vm.message.images = 'Nenhuma imagem.';
          } else {
            $timeout(function() {
              new Swiper(angular.element(document.querySelector('.swiper-container-gallery-company')), {
                prevButton: '.swiper-button-prev-custom-gallery-company',
                nextButton: '.swiper-button-next-custom-gallery-company',
                spaceBetween: 10,
                effect: 'slide'
              });
              vm.prevNextVisibled = vm.images.length > 1;
            }, 100);
          }
        }
      });
    }

    function findFoodTypes() {
      vm.message.foodTypes = '';
      vm.foodTypes = [];
      FoodTypeService.listByCompany(vm.companyDto.idCompany).then(function(response) {
        if (!response.error) {
          vm.foodTypes = vm.foodTypes.concat(response.data);

          if (vm.foodTypes.length === 0) {
            vm.message.foodTypes = null;
          }
        } else {
          vm.message.foodTypes = response.message;
        }
      });
    }

    function findRatings() {
      vm.message.ratings = '';
      vm.isInfiniteScrollRating = false;
      vm.loadingRating = true;
      ratingPaginatorDto.currentPage = ratingPaginatorDto.currentPage + 1;
      RatingService.listByCompany(vm.companyDto.idCompany, ratingPaginatorDto).then(function(response) {
        if (response.error) {
          vm.message.ratings = response.message;
        } else {
          vm.ratings = vm.ratings.concat(response.data.results);
          ratingPaginatorDto = response.data.paginatorDto;
          vm.isInfiniteScrollRating = (angular.isDefined(ratingPaginatorDto) && ratingPaginatorDto.pagination);

          if (vm.ratings.length === 0) {
            vm.message.ratings = 'Nenhum comentário.';
          }
        }

        $timeout(function() {
          vm.loadingRating = false;
        }, 500);
      });
    };

    function openModal(fromTemplateUrl) {
      $ionicModal.fromTemplateUrl(fromTemplateUrl, {
        scope: $scope,
        backdropClickToClose: false,
        hardwareBackButtonClose:false
      }).then(function(modal) {
        var stopListening = $scope.$on('modal.hidden', function() {
          stopListening();
          vm.modal.remove();
        });
        vm.modal = modal;
        vm.modal.show();
      });
    }

    function initialize() {
      $scope.$on('$ionicView.beforeEnter', function() {
        $ionicScrollDelegate.scrollTop();
        vm.companyDto = angular.fromJson($stateParams.object);
        findDetails();
        findImages();
        findFoodTypes();
        findRatings();
        vm.hideLoading();
      });
    }
}
})();
